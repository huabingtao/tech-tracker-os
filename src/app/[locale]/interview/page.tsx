'use client';

import { useState, useEffect, useRef } from 'react';
import { INITIAL_SKILLS } from '@/data/initialSkills';
import { INTERVIEW_QUESTIONS, getGenericQuestions } from '@/data/interviewQuestions';
import { BrainCircuit, Loader2, Sparkles, ChevronRight, Send, List, MessageSquare, Edit3, Save, Activity, FastForward, Trash2 } from 'lucide-react';
import styles from './interview.module.css';
import { useTranslations, useLocale } from 'next-intl';
import ReactMarkdown from 'react-markdown';

// --- IndexedDB Utility for Multi-Skill Sessions ---
const DB_NAME = 'TechTrackerDB';
const STORE_NAME = 'InterviewSessionsV2';

const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 2);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const saveSkillSession = async (skillId: string, data: any) => {
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(data, skillId);
  } catch (e) {
    console.error('Failed to save session to IndexedDB', e);
  }
};

const loadSkillSession = async (skillId: string): Promise<any> => {
  try {
    const db = await initDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const request = tx.objectStore(STORE_NAME).get(skillId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    });
  } catch (e) {
    return null;
  }
};

const clearSkillSession = async (skillId: string) => {
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(skillId);
  } catch (e) {
    console.error('Failed to clear session', e);
  }
};
// -------------------------

export default function InterviewPage() {
  const t = useTranslations('Interview');
  const locale = useLocale();
  const [activeSkillId, setActiveSkillId] = useState<string | null>(null);
  const [selectedSkillName, setSelectedSkillName] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Array<{ level: string; text: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [history, setHistory] = useState<Array<{ type: 'q' | 'a' | 'insight'; text: string; level?: string; score?: number; isStreaming?: boolean }>>([]);
  const [viewMode, setViewMode] = useState<'interview' | 'gallery'>('interview');
  const [showSummary, setShowSummary] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  
  const [customQuestions, setCustomQuestions] = useState<Record<string, any>>({});
  const [editingSkill, setEditingSkill] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到聊天底部
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // 加载持久化状态
  useEffect(() => {
    try {
      const savedQ = localStorage.getItem('tech_tracker_custom_questions');
      if (savedQ) setCustomQuestions(JSON.parse(savedQ));
      
      const lastSkillId = localStorage.getItem('last_active_skill_id');
      if (lastSkillId) {
        handleSkillSelection(lastSkillId);
      }
    } catch (e) {
      console.error('Failed to load initial state from localStorage', e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 持久化当前会话
  useEffect(() => {
    if (activeSkillId && !loading && !isEvaluating) {
      saveSkillSession(activeSkillId, {
        skillName: selectedSkillName,
        questions,
        currentStep,
        history,
        showNextButton
      });
    }
  }, [activeSkillId, questions, currentStep, history, showNextButton, loading, isEvaluating, selectedSkillName]);

  /**
   * 选择一个技能并初始化/恢复面试会话
   */
  const handleSkillSelection = async (skillId: string) => {
    const skill = INITIAL_SKILLS.find(s => s.id === skillId);
    if (!skill) return;

    setLoading(true);
    setActiveSkillId(skillId);
    setSelectedSkillName(skill.name);
    localStorage.setItem('last_active_skill_id', skillId);

    const saved = await loadSkillSession(skillId);
    if (saved && saved.history && saved.history.length > 0) {
      // 恢复已有的会话
      setQuestions(saved.questions);
      setCurrentStep(saved.currentStep);
      setHistory(saved.history);
      setShowNextButton(saved.showNextButton);
      setLoading(false);
    } else {
      // 开始全新的会话
      const localQ = customQuestions[skill.name] || INTERVIEW_QUESTIONS[skill.name] || getGenericQuestions(skill.name);
      setQuestions(localQ);
      setHistory([{ type: 'q', text: localQ[0].text, level: localQ[0].level }]);
      setCurrentStep(0);
      setShowNextButton(false);
      setLoading(false);
    }
    setShowSummary(false);
  };

  /**
   * 更新自定义题目
   */
  const handleUpdateQuestion = (skillName: string, index: number, field: string, value: string) => {
    const updated = { ...customQuestions };
    if (!updated[skillName]) {
      updated[skillName] = [...(INTERVIEW_QUESTIONS[skillName] || getGenericQuestions(skillName))];
    }
    updated[skillName][index] = { ...updated[skillName][index], [field]: value };
    setCustomQuestions(updated);
    localStorage.setItem('tech_tracker_custom_questions', JSON.stringify(updated));
  };

  // 发送用户答案并获取 AI 评估的流式响应
  const handleSend = async () => {
    // 如果输入为空或正在评估中，则不执行
    if (!userAnswer.trim() || isEvaluating) return;

    const currentQuestion = questions[currentStep];
    const userText = userAnswer;
    setUserAnswer('');
    setIsEvaluating(true); // 进入评估状态

    // 在聊天记录中先追加用户回答，并预留一个空的 AI 点评气泡
    const newHistory = [
      ...history,
      { type: 'a' as const, text: userText },
      { type: 'insight' as const, text: '', isStreaming: true } // isStreaming 用于显示加载动画
    ];
    setHistory(newHistory);

    try {
      // 发起 POST 请求调用后端 API
      const response = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQuestion.text,
          userAnswer: userText,
          locale: locale
        })
      });

      if (!response.ok) throw new Error('Failed to evaluate');

      // 获取响应体的读取器 (Reader) 以处理流式数据
      const reader = response.body?.getReader();
      const decoder = new TextDecoder(); // 用于将二进制流转换为文本
      let fullText = '';

      if (reader) {
        while (true) {
          // 持续循环读取流中的每一个数据块 (Chunk)
          const { done, value } = await reader.read();
          if (done) break; // 读取完成，退出循环

          // 解码数据块
          const chunk = decoder.decode(value, { stream: true });
          // SSE 数据包通常以 'data: ' 开头，且可能包含多个数据块
          const lines = chunk.split('\n').filter(l => l.trim() !== '');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6); // 截取 JSON 字符串部分
              if (data === '[DONE]') break; // AI 传输结束标识
              try {
                const json = JSON.parse(data);
                // 提取本次数据块中的文本增量
                const content = json.choices[0]?.delta?.content || '';
                fullText += content; // 累加文本
                
                // 实时更新聊天历史中的最后一个气泡文本
                setHistory(prev => {
                  const updated = [...prev];
                  const last = updated[updated.length - 1];
                  if (last.type === 'insight') {
                    last.text = fullText;
                  }
                  return updated;
                });
              } catch (e) {
                // 忽略非标准的 JSON 数据包
              }
            }
          }
        }
      }

      // 所有数据流传输完成后，从全文中正则匹配评分标识 [SCORE:数字]
      const scoreMatch = fullText.match(/\[SCORE:(\d+)\]/);
      const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;
      // 从显示文本中移除评分标识，并修剪空白
      const cleanText = fullText.replace(/\[SCORE:\d+\]/, '').trim();

      // 最终更新 AI 点评气泡，固化分数并关闭流式动画状态
      setHistory(prev => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last.type === 'insight') {
          last.text = cleanText;
          last.score = score;
          last.isStreaming = false;
        }
        return updated;
      });
      setShowNextButton(true); // 显示“进入下一题”按钮

    } catch (error) {
      console.error(error);
      // 如果请求失败，显示错误提示
      setHistory(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { 
          type: 'insight', 
          text: 'Error connecting to AI evaluator. Please try again.',
          isStreaming: false 
        };
        return updated;
      });
    } finally {
      setIsEvaluating(false); // 结束评估状态
    }
  };

  const handleSkip = () => {
    const newHistory = [
      ...history, 
      { type: 'a' as const, text: '(Question Skipped)' },
      { type: 'insight' as const, text: 'Skipped.', score: 0 }
    ];
    
    setHistory(newHistory);
    setUserAnswer('');
    setShowNextButton(true);
  };

  const handleNext = () => {
    const nextStep = currentStep + 1;
    const newHistory = [...history];
    
    const insights = newHistory.filter(h => h.type === 'insight' && h.score !== undefined);
    const totalScore = insights.reduce((acc, curr) => acc + (curr.score || 0), 0);
    const averageMastery = insights.length > 0 ? Math.round(totalScore / insights.length) : 0;

    try {
      const savedProgress = JSON.parse(localStorage.getItem('tech_tracker_progress') || '[]');
      const existingIdx = savedProgress.findIndex((p: any) => p.skillId === activeSkillId);
      const newEntry = { skillId: activeSkillId, currentMastery: averageMastery, lastReviewedAt: new Date().toISOString() };
      
      if (existingIdx > -1) savedProgress[existingIdx] = { ...savedProgress[existingIdx], ...newEntry };
      else savedProgress.push(newEntry);
      
      localStorage.setItem('tech_tracker_progress', JSON.stringify(savedProgress));
      window.dispatchEvent(new Event('progress_updated'));
    } catch (e) {
      console.error('Failed to update progress in localStorage', e);
    }

    if (nextStep < questions.length) {
      newHistory.push({ type: 'q' as const, text: questions[nextStep].text, level: (questions[nextStep] as any).level });
      setCurrentStep(nextStep);
      setShowNextButton(false);
    } else {
      newHistory.push({ type: 'q' as const, text: 'Interview session completed! You have mastered this domain path.' });
      setShowNextButton(false);
    }
    setHistory(newHistory);
  };

  const resetSession = async () => {
    if (activeSkillId && confirm(t('resetConfirm', { name: selectedSkillName || '' }))) {
      await clearSkillSession(activeSkillId);
      handleSkillSelection(activeSkillId);
    }
  };

  const getLevelColor = (level?: string) => {
    switch (level) {
      case 'Beginner': return 'var(--accent-neon)';
      case 'Intermediate': return 'var(--accent-blue)';
      case 'Advanced': return 'var(--accent-red)';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <BrainCircuit size={32} color="var(--accent-neon)" />
          <h1>{t('title')}</h1>
        </div>
        <div className={styles.viewToggle}>
          <button 
            className={viewMode === 'interview' && !showSummary ? styles.activeToggle : ''} 
            onClick={() => { setViewMode('interview'); setShowSummary(false); }}
          >
            <MessageSquare size={16} /> {t('interview')}
          </button>
          <button 
            className={showSummary ? styles.activeToggle : ''} 
            onClick={() => { setViewMode('interview'); setShowSummary(true); }}
          >
            <Activity size={16} /> {t('summary')}
          </button>
          <button 
            className={viewMode === 'gallery' ? styles.activeToggle : ''} 
            onClick={() => { setViewMode('gallery'); setShowSummary(false); }}
          >
            <List size={16} /> {t('gallery')}
          </button>
          {activeSkillId && (
            <button className={styles.resetBtn} onClick={resetSession} title="Reset">
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </header>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <h3>{t('availableDomains')}</h3>
          <div className={styles.skillList}>
            {INITIAL_SKILLS.map(skill => (
              <button 
                key={skill.id} 
                className={`${styles.skillItem} ${activeSkillId === skill.id ? styles.active : ''}`}
                onClick={() => handleSkillSelection(skill.id)}
              >
                <span>{skill.name}</span>
                <ChevronRight size={16} />
              </button>
            ))}
          </div>
        </aside>

        <main className={styles.main}>
          {showSummary ? (
            <div className={styles.summaryView}>
              <h2>{selectedSkillName} - {t('replyLog')}</h2>
              <div className={styles.summaryList}>
                {history.map((msg, i, arr) => {
                  if (msg.type === 'q') {
                    const nextA = arr.slice(i + 1).find(m => m.type === 'a');
                    const nextI = arr.slice(i + 1).find(m => m.type === 'insight');
                    return (
                      <div key={i} className={styles.summaryCard}>
                        <div className={styles.summaryQ}>
                          <span className={styles.chatBadge} style={{ background: getLevelColor(msg.level) }}>{msg.level}</span>
                          <p>{msg.text}</p>
                        </div>
                        <div className={styles.summaryA}>
                          <strong>{t('yourAnswer')}:</strong>
                          <p>{nextA?.text || t('noAnswer')}</p>
                        </div>
                        {nextI && (
                          <div className={styles.summaryI}>
                            <strong>{t('mastery')}: {nextI.score}%</strong>
                            <div className={styles.markdownContent} style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                              <ReactMarkdown>{nextI.text}</ReactMarkdown>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          ) : viewMode === 'gallery' ? (
            <div className={styles.gallery}>
              <div className={styles.galleryHeader}>
                <h2>{t('questionMatrixGallery')}</h2>
                <p>{t('gallerySubtitle')}</p>
              </div>
              <div className={styles.galleryGrid}>
                {INITIAL_SKILLS.map(skill => {
                  const skillQuestions = customQuestions[skill.name] || INTERVIEW_QUESTIONS[skill.name] || getGenericQuestions(skill.name);
                  const isEditing = editingSkill === skill.name;

                  return (
                    <div key={skill.id} className={`${styles.galleryCard} ${isEditing ? styles.editingCard : ''}`}>
                      <div className={styles.cardHeader}>
                        <h4>{skill.name}</h4>
                        <button className={styles.miniBtn} onClick={() => setEditingSkill(isEditing ? null : skill.name)}>
                          {isEditing ? <Save size={14} /> : <Edit3 size={14} />}
                          {isEditing ? t('done') : t('edit')}
                        </button>
                      </div>
                      <div className={styles.miniQuestions}>
                        {skillQuestions.map((q: any, idx: number) => (
                          <div key={idx} className={styles.editGroup}>
                            <div className={styles.miniQHeader}>
                              <span className={styles.dot} style={{background: getLevelColor(q.level)}}></span>
                              <strong>{q.level}:</strong>
                            </div>
                            {isEditing ? (
                              <div className={styles.editFields}>
                                <input value={q.text} onChange={(e) => handleUpdateQuestion(skill.name, idx, 'text', e.target.value)} placeholder="Question text" />
                              </div>
                            ) : <p className={styles.qPreview}>{q.text}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : !activeSkillId ? (
            <div className={styles.emptyState}>
              <Sparkles size={48} color="var(--accent-blue)" />
              <p>{t('chooseSkill')}</p>
            </div>
          ) : (
            <div className={styles.chatBox}>
              <div className={styles.agentHeader}>
                <strong>{t('agentTitle')}</strong>
                <span>{t('level')} <span style={{ color: 'var(--accent-neon)' }}>{currentStep + 1} / {questions.length}</span></span>
              </div>
              
              <div className={styles.chatHistory}>
                {loading ? (
                  <div className={styles.loader}>
                    <Loader2 className={styles.spin} size={24} />
                    <span>{t('loading')}</span>
                  </div>
                ) : (
                  <>
                    {history.map((msg, idx) => (
                      <div key={idx} className={`${styles.message} ${msg.type === 'q' ? styles.agentMsg : msg.type === 'insight' ? styles.insightMsg : styles.userMsg}`}>
                        {(msg.level || msg.type === 'insight') && (
                          <div className={styles.msgHeader}>
                            {msg.level ? <span className={styles.chatBadge} style={{ background: getLevelColor(msg.level) }}>{msg.level}</span> : <span></span>}
                            {msg.type === 'insight' && msg.score !== undefined && !msg.isStreaming && (
                              <div className={styles.scoreBadge} style={{ 
                                borderColor: msg.score > 70 ? 'var(--accent-neon)' : 'var(--accent-blue)',
                                color: msg.score > 70 ? 'var(--accent-neon)' : 'var(--accent-blue)'
                              }}>
                                {t('mastery')}: {msg.score}%
                              </div>
                            )}
                          </div>
                        )}
                        {msg.type === 'insight' ? (
                          <div className={styles.markdownContent}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.5rem', opacity: 0.7 }}>{t('review')}:</div>
                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                          </div>
                        ) : (
                          <p>{msg.text}</p>
                        )}
                        {msg.isStreaming && <Loader2 size={14} className={styles.spin} style={{ marginTop: '0.5rem' }} />}
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </>
                )}
              </div>

              {!loading && (
                showNextButton ? (
                  <div className={styles.nextArea}>
                    <button className={styles.nextButton} onClick={handleNext}>{t('proceed')} <ChevronRight size={18} /></button>
                  </div>
                ) : (
                  <div className={styles.inputArea}>
                    <textarea 
                      placeholder={t('placeholder')}
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                      disabled={isEvaluating}
                    />
                    <div className={styles.inputActions}>
                      <button className={styles.sendButton} onClick={handleSend} disabled={!userAnswer.trim() || isEvaluating}>
                        {isEvaluating ? <Loader2 size={18} className={styles.spin} /> : <Send size={18} />}
                      </button>
                      <button className={styles.skipButton} onClick={handleSkip} title={t('skip')} disabled={isEvaluating}><FastForward size={18} /><span>{t('skip')}</span></button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
