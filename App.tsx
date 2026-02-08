
import React, { useState, useEffect, useRef } from 'react';
import { 
  Flame, Droplets, Mountain, Wind, Sparkles, 
  Moon, ArrowLeft, Lock, Award, 
  Zap, Crown, Info, Sun,
  Image as ImageIcon, Check, Loader, X,
  ListTodo, ChevronRight, Plus, Trash2, ArrowUp, ArrowDown, Sparkle, Pencil,
  History, BrainCircuit, Send, Repeat, ChevronDown,
  Sword, Minus, Upload, Wand2, Eraser, Play, Archive, Dna
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { AppState, Dragon, ViewState, DragonType, FocusLog, DragonStage, Task, HistoryEntry, EvolutionType } from './types';
import { loadState, saveState, getDragonMood, getTypeColor, getMoodColor, generateNewDragon, getDragonStage, updateDragonStreak, DEFAULT_THRESHOLDS, DEFAULT_STREAK_THRESHOLDS } from './services/utils';
import VoiceInput from './components/VoiceInput';
import FocusTimer from './components/FocusTimer';
import { DragonIcon } from './components/DragonVisuals';

export default function App() {
  const [state, setState] = useState<AppState>(loadState);
  const [view, setView] = useState<ViewState>('DASHBOARD');
  const [selectedDragonId, setSelectedDragonId] = useState<number | null>(null);
  const [timerActive, setTimerActive] = useState(false);
  const [sessionStep, setSessionStep] = useState<'PRE' | 'TIMER' | 'POST'>('PRE');
  const [detailTab, setDetailTab] = useState<'FOCUS' | 'CHRONICLES' | 'EVOLUTION'>('FOCUS');
  const [previewStage, setPreviewStage] = useState<DragonStage | null>(null);
  
  // Session State
  const [intention, setIntention] = useState('');
  const [reflection, setReflection] = useState('');
  const [sessionDuration, setSessionDuration] = useState(25);
  
  // Task State
  const [breakingDown, setBreakingDown] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [showAllActiveTasks, setShowAllActiveTasks] = useState(false);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  
  // Dragon Editing State
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [editName, setEditName] = useState("");
  const [editSubtitle, setEditSubtitle] = useState("");
  const [editIsHabit, setEditIsHabit] = useState(false);
  // Evolution Config State
  const [editEvolutionType, setEditEvolutionType] = useState<EvolutionType>('time');
  const [editThresholds, setEditThresholds] = useState({ baby: 0, teen: 0, adult: 0 });

  // Image & Video Generation State
  const [showImageModal, setShowImageModal] = useState(false);
  const [imgSize, setImgSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [generating, setGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [genError, setGenError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Evolution State
  const [showEvolutionModal, setShowEvolutionModal] = useState(false);
  const [evolutionStep, setEvolutionStep] = useState<'IDLE' | 'GEN_ASSETS' | 'READY_TO_PLAY' | 'PLAYING' | 'DONE'>('IDLE');
  const [evolutionProgress, setEvolutionProgress] = useState(""); 
  const [evolutionVideoUrl, setEvolutionVideoUrl] = useState<string | null>(null);
  const [evolutionNextImage, setEvolutionNextImage] = useState<string | null>(null);
  const [pendingEvolutionData, setPendingEvolutionData] = useState<{dragonId: number, newStage: DragonStage, newHistory: HistoryEntry[]} | null>(null);

  // Oracle/Chat State
  const [oracleThinking, setOracleThinking] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync to local storage
  useEffect(() => {
    saveState(state);
  }, [state]);

  // Auto-scroll chat
  useEffect(() => {
    if (detailTab === 'CHRONICLES') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [state.dragons, detailTab]);

  const activeDragon = state.dragons.find(d => d.id === selectedDragonId);

  // --- Actions ---

  const handleSelectDragon = (id: number) => {
    setSelectedDragonId(id);
    setSessionStep('PRE');
    setDetailTab('FOCUS');
    setPreviewStage(null);
    setTimerActive(false);
    setIntention('');
    setReflection('');
    setBreakingDown(false);
    setView('DETAIL');
    setShowImageModal(false);
    setGeneratedImageUrl(null);
    setEditingTaskId(null);
    setShowAllActiveTasks(false);
    setShowCompletedTasks(false);
    setSessionDuration(25);
  };

  const toggleNap = (dragonId: number) => {
    setState(prev => ({
      ...prev,
      dragons: prev.dragons.map(d => {
        if (d.id !== dragonId) return d;
        
        const mood = getDragonMood(d);
        const isAutoHibernating = mood === 'hibernating';
        const isWakingUp = d.isNapping || isAutoHibernating;
        let newLastFed = d.lastFed;
        
        if (isWakingUp) {
            if (d.isNapping && d.napStartedAt) {
                const napDuration = Date.now() - d.napStartedAt;
                newLastFed = d.lastFed + napDuration;
            } else if (isAutoHibernating) {
                // If auto-hibernating due to neglect (> 1 week), wake up resets lastFed to today
                newLastFed = Date.now();
            }
        }

        return {
          ...d,
          isNapping: !isWakingUp,
          napStartedAt: !isWakingUp ? Date.now() : null,
          lastFed: isWakingUp ? newLastFed : d.lastFed
        };
      })
    }));
  };

  const startSession = () => {
    if (!intention.trim() && (!activeDragon?.tasks || activeDragon.tasks.length === 0)) return;
    
    // Add intention to history if it exists
    if (intention.trim() && activeDragon) {
        addToHistory(activeDragon.id, 'plan', intention, 'user');
    }
    
    setSessionStep('TIMER');
    setTimerActive(true);
  };

  const completeSession = () => {
    setTimerActive(false);
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3'); 
    audio.volume = 0.3;
    audio.play().catch(e => console.log("Audio play failed", e));
    setSessionStep('POST');
  };

  const cancelSession = () => {
    setTimerActive(false);
    setSessionStep('PRE');
  };

  const finalizeSession = () => {
    if (!activeDragon) return;
    
    const pointsEarned = 10;
    const newTotalMinutes = activeDragon.totalFocusMinutes + sessionDuration;
    const newStreak = updateDragonStreak(activeDragon);

    // Prepare updated dragon data for stage calculation
    const updatedDragonBase = {
        ...activeDragon,
        lastFed: Date.now(), 
        totalFocusMinutes: newTotalMinutes,
        currentStreak: newStreak,
    };
    
    const newStage = getDragonStage(updatedDragonBase);
    const hasEvolved = newStage !== activeDragon.stage;

    // Get completed tasks
    const completedTaskTitles = activeDragon.tasks.filter(t => t.isCompleted).map(t => t.title);
    
    // Create new log
    const newLog: FocusLog = {
      id: Date.now().toString(),
      dragonId: activeDragon.id,
      timestamp: Date.now(),
      durationMinutes: sessionDuration,
      intention: intention || "Focus Session",
      reflection,
      completedTasks: completedTaskTitles
    };
    
    // Prepare history update
    let updatedHistory = [...activeDragon.history];
    if (reflection.trim()) {
        updatedHistory.push({
            id: Date.now().toString(),
            timestamp: Date.now(),
            type: 'reflection',
            content: reflection,
            role: 'user'
        });
    }

    // 1. Update everything EXCEPT the stage if evolving
    setState(prev => ({
      ...prev,
      userPoints: prev.userPoints + pointsEarned,
      logs: [newLog, ...prev.logs],
      dragons: prev.dragons.map(d => {
        if (d.id !== activeDragon.id) return d;
        return {
          ...updatedDragonBase,
          stage: hasEvolved ? d.stage : newStage, // Keep old stage if evolving, update otherwise
          history: updatedHistory
        };
      })
    }));

    if (hasEvolved) {
      // 2. Trigger Evolution Flow
      setPendingEvolutionData({
          dragonId: activeDragon.id,
          newStage: newStage,
          newHistory: updatedHistory
      });
      setShowEvolutionModal(true);
      setEvolutionStep('IDLE');
    } else {
        setView('DASHBOARD');
    }
  };

  // --- Cinematic Evolution Logic ---

  const generateCinematicAssets = async () => {
      if (!activeDragon || !pendingEvolutionData) return;
      setEvolutionStep('GEN_ASSETS');
      setGenError(null);

      try {
          const ai = await getGeminiClient();
          const { newStage } = pendingEvolutionData;

          // --- Step 1: Generate Next Stage Image ---
          setEvolutionProgress(`Summoning ${newStage} form...`);
          
          const visualDesc = `A high quality, 3d render of a ${newStage} ${activeDragon.type} dragon. ${activeDragon.type} element theme. Cute, expressive, magical. Isolated on a dark background.`;
          
          const imgResponse = await ai.models.generateContent({
            model: 'gemini-3-pro-image-preview',
            contents: { parts: [{ text: visualDesc }] },
            config: { imageConfig: { imageSize: '1K', aspectRatio: '1:1' } }
          });

          let rawImgBase64 = null;
          let rawMime = 'image/png';
          if (imgResponse.candidates?.[0]?.content?.parts) {
              for (const part of imgResponse.candidates[0].content.parts) {
                  if (part.inlineData) {
                      rawImgBase64 = part.inlineData.data;
                      rawMime = part.inlineData.mimeType || 'image/png';
                      break;
                  }
              }
          }
          if (!rawImgBase64) throw new Error("Failed to conjure the dragon's new form.");

          // --- Step 2: Remove Background (Nano Banana) ---
          setEvolutionProgress("Polishing scales (removing background)...");
          
          let finalImgBase64 = rawImgBase64;
          try {
              const bgResponse = await ai.models.generateContent({
                  model: 'gemini-2.5-flash-image',
                  contents: {
                      parts: [
                          { inlineData: { data: rawImgBase64, mimeType: rawMime } },
                          { text: "Remove the background completely. Return the subject with a transparent background." }
                      ]
                  }
              });
              // Extract the result if available
              if (bgResponse.candidates?.[0]?.content?.parts) {
                  for (const part of bgResponse.candidates[0].content.parts) {
                      if (part.inlineData) {
                          finalImgBase64 = part.inlineData.data;
                          break;
                      }
                  }
              }
          } catch (bgError) {
              console.warn("BG removal failed, using raw image", bgError);
          }
          
          const nextImgUrl = `data:image/png;base64,${finalImgBase64}`;
          setEvolutionNextImage(nextImgUrl);

          // --- Step 3: Generate Transformation Video (Veo) ---
          setEvolutionProgress("Weaving transformation spell (this takes a moment)...");
          
          let startImageBytes = undefined;
          let startMimeType = undefined;
          
          if (activeDragon.imageUrl) {
              startImageBytes = activeDragon.imageUrl.split(',')[1];
              startMimeType = activeDragon.imageUrl.split(';')[0].split(':')[1];
          }

          const prompt = `Cinematic transformation. A ${activeDragon.stage} ${activeDragon.type} dragon evolving into a ${newStage}. ${activeDragon.stage === 'egg' ? 'Egg cracking open, shell breaking apart, energy bursting out.' : 'Dragon growing larger, glowing with magical energy, scales shifting.'} High quality, 3d render style.`;

          let operation;
          const videoConfig = {
              numberOfVideos: 1,
              resolution: '720p',
              aspectRatio: '9:16', 
              ...(startImageBytes ? {} : {}), 
              lastFrame: { imageBytes: finalImgBase64, mimeType: 'image/png' }
          };

          if (startImageBytes) {
               operation = await ai.models.generateVideos({
                  model: 'veo-3.1-fast-generate-preview',
                  prompt: prompt,
                  image: { imageBytes: startImageBytes, mimeType: startMimeType || 'image/png' },
                  config: videoConfig
              });
          } else {
               operation = await ai.models.generateVideos({
                  model: 'veo-3.1-fast-generate-preview',
                  prompt: prompt,
                  config: videoConfig
              });
          }

          while (!operation.done) {
              await new Promise(resolve => setTimeout(resolve, 5000));
              operation = await ai.operations.getVideosOperation({operation: operation});
          }

          const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
          if (!videoUri) throw new Error("The spell fizzled (Video gen failed).");

          const videoRes = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
          const videoBlob = await videoRes.blob();
          const videoUrl = URL.createObjectURL(videoBlob);
          
          setEvolutionVideoUrl(videoUrl);
          setEvolutionStep('READY_TO_PLAY');

      } catch (e: any) {
          console.error("Evolution failed", e);
          setGenError(e.message || "Evolution interrupted.");
          if (evolutionNextImage) {
              setEvolutionStep('READY_TO_PLAY');
          }
      }
  };

  const playEvolution = () => {
      setEvolutionStep('PLAYING');
  };

  const completeEvolution = () => {
      if (pendingEvolutionData) {
          setState(prev => ({
              ...prev,
              dragons: prev.dragons.map(d => {
                  if (d.id !== pendingEvolutionData.dragonId) return d;
                  return {
                      ...d,
                      stage: pendingEvolutionData.newStage,
                      imageUrl: evolutionNextImage || d.imageUrl, 
                      history: [...d.history, {
                          id: Date.now().toString(),
                          timestamp: Date.now(),
                          type: 'milestone_complete',
                          content: `Evolved to ${pendingEvolutionData.newStage}!`,
                          role: 'system'
                      }]
                  };
              })
          }));
      }
      setShowEvolutionModal(false);
      setEvolutionStep('IDLE');
      setEvolutionVideoUrl(null);
      setEvolutionNextImage(null);
      setPendingEvolutionData(null);
      setView('DASHBOARD');
  };

  const manualCompleteProject = () => {
    if (!activeDragon) return;
    if (!confirm(`Are you sure you want to mark your main project as COMPLETE? This will evolve ${activeDragon.name} to the Ancient stage.`)) return;
    addToHistory(activeDragon.id, 'milestone_complete', 'PROJECT COMPLETED - LEGENDARY STATUS ACHIEVED', 'system');
    setState(prev => ({
      ...prev,
      dragons: prev.dragons.map(d => {
        if (d.id !== activeDragon.id) return d;
        return { ...d, stage: 'ancient' };
      })
    }));
  };

  const unlockDragon = () => {
    if (state.userPoints < 100) return;
    const newId = Math.max(...state.dragons.map(d => d.id)) + 1;
    const newDragon = generateNewDragon(newId);
    setState(prev => ({
      ...prev,
      userPoints: prev.userPoints - 100,
      dragons: [...prev.dragons, newDragon]
    }));
    setView('DASHBOARD');
  };

  const addToHistory = (dragonId: number, type: HistoryEntry['type'], content: string, role: HistoryEntry['role']) => {
      setState(prev => ({
          ...prev,
          dragons: prev.dragons.map(d => {
              if (d.id !== dragonId) return d;
              return {
                  ...d,
                  history: [...d.history, {
                      id: Date.now().toString() + Math.random(),
                      timestamp: Date.now(),
                      type,
                      content,
                      role
                  }]
              };
          })
      }));
  };

  const deleteHistoryEntry = (dragonId: number, entryId: string) => {
    if (!confirm("Delete this chronicle entry?")) return;
    setState(prev => ({
        ...prev,
        dragons: prev.dragons.map(d => {
            if (d.id !== dragonId) return d;
            return {
                ...d,
                history: d.history.filter(h => h.id !== entryId)
            };
        })
    }));
  };

  const startEditingInfo = () => {
      if (!activeDragon) return;
      setEditName(activeDragon.name);
      setEditSubtitle(activeDragon.subtitle || "");
      setEditIsHabit(!!activeDragon.isHabit);
      const config = activeDragon.evolutionConfig || (activeDragon.isHabit ? { type: 'streak', thresholds: DEFAULT_STREAK_THRESHOLDS } : { type: 'time', thresholds: DEFAULT_THRESHOLDS });
      setEditEvolutionType(config.type);
      setEditThresholds({ ...config.thresholds });
      setIsEditingInfo(true);
  };

  const saveDragonInfo = () => {
      if (!activeDragon) return;
      setState(prev => ({
          ...prev,
          dragons: prev.dragons.map(d => {
              if (d.id !== activeDragon.id) return d;
              return {
                  ...d,
                  name: editName.trim() || d.name,
                  subtitle: editSubtitle.trim() || d.subtitle,
                  isHabit: editIsHabit,
                  evolutionConfig: {
                    type: editEvolutionType,
                    thresholds: editThresholds
                  }
              };
          })
      }));
      setIsEditingInfo(false);
  };

  const addTask = (title: string) => {
    if (!activeDragon || !title.trim()) return;
    const newTask: Task = {
        id: Date.now().toString() + Math.random(),
        title: title.trim(),
        isCompleted: false,
        createdAt: Date.now()
    };
    updateDragonTasks([...activeDragon.tasks, newTask]);
    setEditingTaskId(newTask.id);
    setEditingText(newTask.title);
  };

  const updateDragonTasks = (newTasks: Task[]) => {
      if (!activeDragon) return;
      setState(prev => ({
          ...prev,
          dragons: prev.dragons.map(d => d.id === activeDragon.id ? { ...d, tasks: newTasks } : d)
      }));
  };

  const toggleTaskComplete = (taskId: string) => {
    if (!activeDragon) return;
    const task = activeDragon.tasks.find(t => t.id === taskId);
    const isNowComplete = !task?.isCompleted;
    const newTasks = activeDragon.tasks.map(t => 
        t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
    );
    updateDragonTasks(newTasks);
    if (isNowComplete && task) {
        addToHistory(activeDragon.id, 'milestone_complete', `Completed milestone: ${task.title}`, 'system');
    }
  };

  const moveTask = (index: number, direction: -1 | 1) => {
      if (!activeDragon) return;
      const tasks = [...activeDragon.tasks];
      if (index + direction < 0 || index + direction >= tasks.length) return;
      const temp = tasks[index];
      tasks[index] = tasks[index + direction];
      tasks[index + direction] = temp;
      updateDragonTasks(tasks);
  };

  const removeTask = (taskId: string) => {
      if (!activeDragon) return;
      updateDragonTasks(activeDragon.tasks.filter(t => t.id !== taskId));
  };

  const startEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingText(task.title);
  };

  const saveEditing = () => {
    if (!activeDragon || !editingTaskId || !editingText.trim()) return;
    const newTasks = activeDragon.tasks.map(t => 
        t.id === editingTaskId ? { ...t, title: editingText.trim() } : t
    );
    updateDragonTasks(newTasks);
    setEditingTaskId(null);
    setEditingText("");
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditingText("");
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === index) return;
    if (activeDragon) {
        const tasks = [...activeDragon.tasks];
        const item = tasks[draggedItemIndex];
        tasks.splice(draggedItemIndex, 1);
        tasks.splice(index, 0, item);
        updateDragonTasks(tasks);
        setDraggedItemIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
  };

  const getGeminiClient = async () => {
      const aiStudio = (window as any).aistudio;
      if (aiStudio) {
          const hasKey = await aiStudio.hasSelectedApiKey();
          if (!hasKey) {
              await aiStudio.openSelectKey();
          }
      }
      let apiKey = "";
      try {
        apiKey = process.env.API_KEY || "";
      } catch (e) {
        console.warn("process is not defined");
      }
      return new GoogleGenAI({ apiKey });
  };

  const handleGenerateMilestones = async () => {
    if (!intention.trim()) return;
    setBreakingDown(true);
    if (activeDragon) {
        addToHistory(activeDragon.id, 'plan', intention, 'user');
    }

    try {
        const ai = await getGeminiClient();
        const recentHistory = activeDragon?.history.slice(-5).map(h => `${h.role}: ${h.content}`).join('\n') || "No previous context.";
        const projectTitle = activeDragon?.subtitle || "General Project";
        const prompt = `You are a strategic project planner using the CLEAR -> SPLIT -> SHAPE -> SEQUENCE framework. User Intent: "${intention}". Project Context: "${projectTitle}". Recent History: ${recentHistory}. Return ONLY a JSON array of strings. e.g. ["Choose topic", "Draft outline", "Write first paragraph"].`;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: { parts: [{ text: prompt }]},
            config: { responseMimeType: 'application/json' }
        });
        
        const text = response.text;
        if (text) {
            let cleanText = text.trim();
            if (cleanText.startsWith('```json')) cleanText = cleanText.slice(7);
            if (cleanText.startsWith('```')) cleanText = cleanText.slice(3);
            if (cleanText.endsWith('```')) cleanText = cleanText.slice(0, -3);
            const taskTitles = JSON.parse(cleanText);
            if (Array.isArray(taskTitles)) {
                const newTasks: Task[] = taskTitles.map(t => ({
                    id: Date.now().toString() + Math.random(),
                    title: t,
                    isCompleted: false,
                    createdAt: Date.now()
                }));
                updateDragonTasks([...(activeDragon?.tasks || []), ...newTasks]);
                if (activeDragon) { addToHistory(activeDragon.id, 'plan', `Strategic plan created.`, 'ai'); }
                setIntention(""); 
            }
        }
    } catch (e) {
        console.error("Failed to breakdown task", e);
    } finally {
        setBreakingDown(false);
    }
  };

  const consultOracle = async () => {
      if (!activeDragon) return;
      setOracleThinking(true);
      try {
          const ai = await getGeminiClient();
          const historyText = activeDragon.history.map(h => `[${h.type.toUpperCase()}] ${h.role}: ${h.content}`).join('\n');
          const tasksText = activeDragon.tasks.map(t => `- [${t.isCompleted ? 'x' : ' '}] ${t.title}`).join('\n');
          const prompt = `You are the Dragon Oracle. Analyze the user's project: "${activeDragon.subtitle}". HISTORY: ${historyText}. CURRENT TASKS: ${tasksText}. Provide a brief, wise insight. Max 2 sentences.`;
          const response = await ai.models.generateContent({
              model: 'gemini-3-flash-preview',
              contents: { parts: [{ text: prompt }]}
          });
          if (response.text) {
              addToHistory(activeDragon.id, 'insight', response.text, 'ai');
          }
      } catch (e) {
          console.error(e);
      } finally {
          setOracleThinking(false);
      }
  };

  const sendChatToHistory = () => {
      if (!activeDragon || !chatInput.trim()) return;
      addToHistory(activeDragon.id, 'chat', chatInput, 'user');
      setChatInput("");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeDragon) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setState(prev => ({
          ...prev,
          dragons: prev.dragons.map(d => d.id === activeDragon.id ? { ...d, imageUrl: result } : d)
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeBackground = async () => {
    if (!activeDragon?.imageUrl) return;
    setGenerating(true);
    setGenError(null);
    try {
        const ai = await getGeminiClient();
        const base64Data = activeDragon.imageUrl.split(',')[1];
        const mimeType = activeDragon.imageUrl.split(';')[0].split(':')[1];
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { inlineData: { data: base64Data, mimeType } },
                    { text: "Remove the background from this image. Return the subject on a transparent background." }
                ]
            }
        });
        let foundImage = false;
        if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    const newBase64 = part.inlineData.data;
                    const newUrl = `data:image/png;base64,${newBase64}`;
                    setState(prev => ({
                        ...prev,
                        dragons: prev.dragons.map(d => d.id === activeDragon.id ? { ...d, imageUrl: newUrl } : d)
                    }));
                    foundImage = true;
                    break;
                }
            }
        }
        if (!foundImage) throw new Error("No image returned.");
    } catch (e: any) {
        console.error(e);
        setGenError("Failed to remove background.");
    } finally {
        setGenerating(false);
    }
  };

  const generateDragonImage = async () => {
    if (!activeDragon) return;
    setGenerating(true);
    setGenError(null);
    setGeneratedImageUrl(null);
    try {
      const ai = await getGeminiClient();
      let visualDesc = `Fantasy art of ${activeDragon.name}, a ${activeDragon.stage} ${activeDragon.type} dragon. Highly detailed, 8k resolution.`;
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: { parts: [{ text: visualDesc }] },
        config: { imageConfig: { imageSize: imgSize, aspectRatio: '1:1' } }
      });
      let foundImage = false;
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const base64Str = part.inlineData.data;
            const url = `data:image/png;base64,${base64Str}`;
            setGeneratedImageUrl(url);
            foundImage = true;
            break;
          }
        }
      }
      if (!foundImage) throw new Error("No image returned.");
    } catch (e: any) {
      console.error(e);
      setGenError(e.message || "Failed to summon image.");
    } finally {
      setGenerating(false);
    }
  };

  const saveGeneratedImage = () => {
      if (generatedImageUrl && activeDragon) {
          setState(prev => ({
              ...prev,
              dragons: prev.dragons.map(d => d.id === activeDragon.id ? { ...d, imageUrl: generatedImageUrl } : d)
          }));
          setShowImageModal(false);
          setGeneratedImageUrl(null);
      }
  };

  const renderEvolutionModal = () => {
      const nextStage = pendingEvolutionData?.newStage || activeDragon?.stage;
      return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-500">
          <div className="w-full max-w-sm flex flex-col items-center">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 mb-6 relative z-10 flex items-center justify-center gap-2 animate-bounce-subtle">
                  <Sparkles size={28} className="text-amber-400" /> Evolution Imminent <Sparkles size={28} className="text-amber-400" />
              </h2>
              <div className="relative w-64 h-96 bg-slate-900/50 rounded-3xl border border-amber-500/30 overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.2)]">
                  <div className="absolute inset-0 bg-gradient-to-b from-amber-900/20 to-transparent"></div>
                  {evolutionStep === 'IDLE' && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                          <DragonIcon type={activeDragon!.type} stage={activeDragon!.stage} size={120} imageUrl={activeDragon?.imageUrl} className="mb-6 animate-pulse-slow" />
                          <p className="text-slate-300 text-sm mb-8">
                              {activeDragon?.name} has gathered enough energy to evolve into a <span className="font-bold text-amber-400 uppercase">{nextStage}</span> dragon!
                          </p>
                          <button 
                            onClick={generateCinematicAssets}
                            className="w-full py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold rounded-xl shadow-lg shadow-amber-900/40 hover:scale-105 transition-transform flex items-center justify-center gap-2"
                          >
                              <Wand2 size={18} /> Begin Ritual
                          </button>
                      </div>
                  )}
                  {evolutionStep === 'GEN_ASSETS' && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-6">
                          <div className="relative">
                              <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full animate-pulse"></div>
                              <Loader className="animate-spin text-amber-400 relative z-10" size={48} />
                          </div>
                          <div className="space-y-2">
                              <p className="text-amber-200 font-bold animate-pulse">{evolutionProgress}</p>
                              <p className="text-xs text-slate-500">Using Gemini 3 Pro & Veo</p>
                          </div>
                      </div>
                  )}
                  {evolutionStep === 'READY_TO_PLAY' && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                          <div className="w-24 h-24 rounded-full bg-amber-500/20 flex items-center justify-center mb-6 animate-pulse ring-2 ring-amber-500/50">
                              <Play size={40} className="text-amber-400 ml-1" />
                          </div>
                          <p className="text-white font-bold mb-6">Transformation Ready</p>
                          <button 
                            onClick={playEvolution}
                            className="w-full py-4 bg-white text-slate-900 font-bold rounded-xl shadow-lg hover:bg-slate-100 transition-colors"
                          >
                              Witness Evolution
                          </button>
                      </div>
                  )}
                  {evolutionStep === 'PLAYING' && evolutionVideoUrl && (
                      <div className="absolute inset-0 bg-black">
                          <video 
                            src={evolutionVideoUrl} 
                            autoPlay 
                            onEnded={completeEvolution}
                            className="w-full h-full object-cover"
                          />
                          <button 
                            onClick={completeEvolution}
                            className="absolute bottom-4 right-4 px-4 py-1.5 bg-black/50 backdrop-blur rounded-full text-white/50 text-xs hover:text-white hover:bg-black/70 transition-all"
                          >
                              Skip
                          </button>
                      </div>
                  )}
              </div>
              {evolutionStep === 'IDLE' && (
                  <button onClick={completeEvolution} className="mt-6 text-slate-500 text-xs hover:text-slate-300 underline">Skip animation & evolve instantly</button>
              )}
              {genError && (
                  <div className="mt-4 p-3 bg-red-900/50 border border-red-500/30 rounded-xl text-red-200 text-xs text-center max-w-xs">
                      {genError}
                      <button onClick={completeEvolution} className="block mt-2 mx-auto underline font-bold">Continue anyway</button>
                  </div>
              )}
          </div>
      </div>
      );
  };

  const renderImageModalContent = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 rounded-2xl border border-slate-700 w-full max-w-lg overflow-hidden shadow-2xl relative">
        <button 
          onClick={() => setShowImageModal(false)}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors z-10"
        >
          <X size={20} />
        </button>
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
            <ImageIcon className="text-purple-400" size={20} /> Dragon Portrait
          </h3>
          <p className="text-slate-400 text-sm mb-6">Summon or upload a vision of {activeDragon?.name}.</p>
          {!generatedImageUrl && (
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Resolution</label>
              <div className="flex gap-2">
                {(['1K', '2K', '4K'] as const).map(size => (
                  <button
                    key={size}
                    onClick={() => setImgSize(size)}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-all ${
                      imgSize === size 
                        ? 'bg-purple-600 border-purple-500 text-white' 
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="bg-slate-950 rounded-xl aspect-square flex items-center justify-center border border-slate-800 relative overflow-hidden group">
            {generating ? (
              <div className="flex flex-col items-center gap-3">
                <Loader className="animate-spin text-purple-500" size={32} />
                <span className="text-xs text-purple-400 animate-pulse">Conjuring...</span>
              </div>
            ) : generatedImageUrl ? (
              <img src={generatedImageUrl} alt="Generated Dragon" className="w-full h-full object-cover" />
            ) : activeDragon?.imageUrl ? (
               <img src={activeDragon.imageUrl} alt="Current Dragon" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-8 opacity-30">
                <DragonIcon type={activeDragon!.type} stage={activeDragon!.stage} size={64} className="mx-auto mb-2 text-slate-500" />
                <p className="text-sm">Ready to generate</p>
              </div>
            )}
            
            {generatedImageUrl && (
                <div className="absolute bottom-4 right-4 flex gap-2">
                    <button 
                      onClick={saveGeneratedImage}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs font-bold text-white shadow-lg"
                    >
                      Save as Portrait
                    </button>
                </div>
            )}
          </div>
          {genError && <p className="mt-4 text-xs text-red-400 bg-red-900/10 p-2 rounded border border-red-900/30">{genError}</p>}
          <div className="mt-6 flex flex-col gap-3">
             {!generatedImageUrl ? (
               <>
               <button
                onClick={generateDragonImage}
                disabled={generating}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl text-white font-bold shadow-lg shadow-purple-900/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
               >
                 <Wand2 size={16} /> {generating ? 'Summoning...' : 'Generate New (Nano Banana Pro)'}
               </button>
               <div className="flex gap-2">
                   <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-300 font-bold transition-all flex items-center justify-center gap-2"
                   >
                       <Upload size={16} /> Upload Photo
                   </button>
                   <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                   {activeDragon?.imageUrl && (
                       <button 
                        onClick={removeBackground}
                        className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-300 font-bold transition-all flex items-center justify-center gap-2"
                       >
                           <Eraser size={16} /> Remove BG
                       </button>
                   )}
               </div>
               </>
             ) : (
               <button
                onClick={() => setGeneratedImageUrl(null)}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-300 font-bold transition-all"
               >
                 Discard & Try Again
               </button>
             )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderTaskItem = (task: Task, idx: number, readonly: boolean) => {
    if (editingTaskId === task.id) {
        return (
            <div key={task.id} className="flex items-center gap-2 bg-slate-800 p-3 rounded-xl border border-indigo-500 animate-in fade-in">
                <input
                    autoFocus
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="flex-1 bg-transparent text-base text-white focus:outline-none px-2"
                    onKeyDown={(e) => { 
                    if (e.key === 'Enter') saveEditing(); 
                    if (e.key === 'Escape') cancelEditing(); 
                    }}
                />
                <button onClick={saveEditing} className="p-2 hover:bg-emerald-500/20 rounded text-emerald-400 transition-colors"><Check size={18}/></button>
                <button onClick={cancelEditing} className="p-2 hover:bg-slate-700 rounded text-slate-400 transition-colors"><X size={18}/></button>
            </div>
        );
    }
    return (
        <div 
          key={task.id} 
          draggable={!readonly && !task.isCompleted}
          onDragStart={(e) => handleDragStart(e, idx)}
          onDragOver={(e) => handleDragOver(e, idx)}
          onDragEnd={handleDragEnd}
          className={`group flex items-center gap-3 p-4 rounded-xl border transition-all ${
            task.isCompleted 
                ? 'bg-slate-900/30 border-slate-800' 
                : draggedItemIndex === idx 
                    ? 'bg-slate-800 border-indigo-500 opacity-50 dashed' 
                    : 'bg-slate-800/50 border-slate-700/50 hover:border-indigo-500/30 cursor-move'
          }`}
        >
            {!readonly && !task.isCompleted && (
              <div className="flex flex-col gap-2 text-slate-500 mr-2 group-hover:text-slate-300">
                  <button onClick={(e) => { e.stopPropagation(); moveTask(idx, -1); }} className="hover:text-white p-2 hover:bg-slate-700/50 rounded-lg transition-colors"><ArrowUp size={16} /></button>
                  <button onClick={(e) => { e.stopPropagation(); moveTask(idx, 1); }} className="hover:text-white p-2 hover:bg-slate-700/50 rounded-lg transition-colors"><ArrowDown size={16} /></button>
              </div>
            )}
            <button 
                onClick={() => toggleTaskComplete(task.id)}
                className={`flex-shrink-0 w-6 h-6 rounded border flex items-center justify-center transition-colors ${task.isCompleted ? 'bg-emerald-500 border-emerald-500' : 'border-slate-500 hover:border-emerald-400'}`}
            >
                {task.isCompleted && <Check size={16} className="text-white" />}
            </button>
            <span className={`flex-1 text-base ${task.isCompleted ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                {task.title}
            </span>
            {!readonly && !task.isCompleted && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => startEditing(task)} className="p-2 text-slate-500 hover:text-indigo-400 hover:bg-slate-700/50 rounded-lg"><Pencil size={16} /></button>
                    <div className="w-px h-4 bg-slate-700 mx-2"></div>
                    <button onClick={() => removeTask(task.id)} className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-900/10 rounded-lg"><Trash2 size={16} /></button>
                </div>
            )}
        </div>
    );
  };

  const renderTaskList = (readonly = false) => {
      if (!activeDragon?.tasks || activeDragon.tasks.length === 0) return null;
      const activeTasks = activeDragon.tasks.filter(t => !t.isCompleted);
      const completedTasks = activeDragon.tasks.filter(t => t.isCompleted);
      const visibleActiveTasks = showAllActiveTasks ? activeTasks : activeTasks.slice(0, 4);
      const hasHiddenActive = activeTasks.length > 4;

      return (
          <div className="space-y-3 mt-4">
              {visibleActiveTasks.map((task, idx) => renderTaskItem(task, idx, readonly))}
              {hasHiddenActive && !showAllActiveTasks && (
                  <button 
                    onClick={() => setShowAllActiveTasks(true)}
                    className="w-full py-3 text-sm font-bold text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 rounded-xl transition-colors flex items-center justify-center gap-1"
                  >
                      Show {activeTasks.length - 4} more <ChevronDown size={14} />
                  </button>
              )}
              {showAllActiveTasks && hasHiddenActive && (
                  <button 
                    onClick={() => setShowAllActiveTasks(false)}
                    className="w-full py-3 text-sm font-bold text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 rounded-xl transition-colors flex items-center justify-center gap-1"
                  >
                      Show less <ArrowUp size={14} />
                  </button>
              )}
              {completedTasks.length > 0 && (
                  <div className="pt-6 mt-4 border-t border-slate-800/50">
                      <button 
                        onClick={() => setShowCompletedTasks(!showCompletedTasks)}
                        className="group flex items-center gap-3 text-sm font-bold text-slate-600 hover:text-emerald-500 transition-colors uppercase tracking-wider mb-3 w-full"
                      >
                          <div className="p-1.5 rounded bg-slate-800 group-hover:bg-slate-700 transition-colors">
                            {showCompletedTasks ? <ChevronDown size={12}/> : <ChevronRight size={12}/>}
                          </div>
                          Completed ({completedTasks.length})
                      </button>
                      {showCompletedTasks && (
                          <div className="space-y-3 pl-3 border-l-2 border-slate-800 animate-in slide-in-from-top-2">
                              {completedTasks.map((task, idx) => renderTaskItem(task, idx, true))}
                          </div>
                      )}
                  </div>
              )}
          </div>
      );
  };

  const renderChronicles = () => {
      if (!activeDragon) return null;
      return (
          <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-10 duration-300">
               <div className="flex items-center justify-between mb-4">
                   <h3 className="text-xl font-bold text-slate-200 flex items-center gap-2">
                       <Archive size={20} className="text-indigo-400"/> Archives
                   </h3>
                   <button 
                    onClick={consultOracle}
                    disabled={oracleThinking}
                    className="px-4 py-2 bg-indigo-900/50 hover:bg-indigo-800/50 border border-indigo-700/50 rounded-xl text-sm font-bold text-indigo-200 flex items-center gap-2 transition-colors disabled:opacity-50"
                   >
                       {oracleThinking ? <Loader size={16} className="animate-spin"/> : <BrainCircuit size={16}/>}
                       Consult Oracle
                   </button>
               </div>
               <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 mb-4 space-y-4">
                   {activeDragon.history.length === 0 ? (
                       <div className="text-center text-slate-600 text-base py-10 italic">
                           The archives are empty. Begin your journey to write history.
                       </div>
                   ) : (
                       activeDragon.history.map(entry => (
                           <div key={entry.id} className={`group/entry flex flex-col ${entry.role === 'user' ? 'items-end' : 'items-start'}`}>
                               <div className="flex items-start gap-2 max-w-[95%]">
                                   {entry.role === 'user' && (
                                       <button 
                                        onClick={() => deleteHistoryEntry(activeDragon.id, entry.id)}
                                        className="opacity-0 group-hover/entry:opacity-100 p-2 text-slate-600 hover:text-red-400 transition-opacity self-center rounded-lg hover:bg-slate-800/50"
                                        title="Delete entry"
                                       >
                                           <Trash2 size={14} />
                                       </button>
                                   )}
                                   <div className={`rounded-2xl p-4 text-base ${
                                       entry.type === 'insight' ? 'bg-indigo-900/40 border border-indigo-500/30 text-indigo-100' :
                                       entry.role === 'user' ? 'bg-slate-800 text-slate-200' : 
                                       entry.role === 'system' ? 'bg-slate-900/50 text-slate-500 text-sm italic border border-slate-800' :
                                       'bg-slate-800/50 text-slate-300 border border-slate-700'
                                   }`}>
                                       {entry.type === 'milestone_complete' && <Check size={14} className="inline mr-2 text-emerald-500"/>}
                                       {entry.type === 'insight' && <BrainCircuit size={16} className="inline mr-2 text-indigo-400 mb-1"/>}
                                       {entry.content}
                                   </div>
                                   {entry.role !== 'user' && (
                                       <button 
                                        onClick={() => deleteHistoryEntry(activeDragon.id, entry.id)}
                                        className="opacity-0 group-hover/entry:opacity-100 p-2 text-slate-600 hover:text-red-400 transition-opacity self-center rounded-lg hover:bg-slate-800/50"
                                        title="Delete entry"
                                       >
                                           <Trash2 size={14} />
                                       </button>
                                   )}
                               </div>
                               <span className="text-xs text-slate-600 mt-1 px-1">
                                   {new Date(entry.timestamp).toLocaleDateString()}
                               </span>
                           </div>
                       ))
                   )}
                   <div ref={messagesEndRef} />
               </div>
               <div className="relative">
                   <input 
                    type="text" 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendChatToHistory()}
                    placeholder="Log a thought or chat with history..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-5 py-4 pr-14 text-base focus:outline-none focus:border-indigo-500 transition-colors"
                   />
                   <button 
                    onClick={sendChatToHistory}
                    disabled={!chatInput.trim()}
                    className="absolute right-3 top-3 p-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white disabled:opacity-0 transition-all"
                   >
                       <Send size={18} />
                   </button>
               </div>
          </div>
      );
  };

  const renderEvolutionTab = () => {
    if (!activeDragon) return null;
    const stages: DragonStage[] = ['egg', 'baby', 'teen', 'adult', 'ancient'];
    
    return (
        <div className="animate-in slide-in-from-bottom-10 fade-in duration-300 flex-1 flex flex-col">
            <h3 className="text-xl font-bold text-slate-200 flex items-center gap-2 mb-6">
                <Dna size={20} className="text-amber-400" /> Evolution Path
            </h3>
            <div className="flex flex-col gap-4">
                {stages.map((stage, index) => {
                    const isCurrent = activeDragon.stage === stage;
                    const isPreviewing = previewStage === stage;
                    const isUnlocked = stages.indexOf(activeDragon.stage) >= index;

                    return (
                        <button
                            key={stage}
                            onClick={() => setPreviewStage(stage)}
                            className={`flex items-center gap-4 p-4 rounded-xl border transition-all text-left group ${
                                isPreviewing 
                                    ? 'bg-amber-900/30 border-amber-500/50 shadow-lg shadow-amber-900/20' 
                                    : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800'
                            }`}
                        >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${
                                isPreviewing 
                                    ? 'bg-amber-500/20 border-amber-500 text-amber-400' 
                                    : isUnlocked 
                                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                                        : 'bg-slate-900 border-slate-700 text-slate-600'
                            }`}>
                                <DragonIcon type={activeDragon.type} stage={stage} size={24} className={isUnlocked ? 'opacity-100' : 'opacity-40 grayscale'} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <span className={`font-bold capitalize ${isPreviewing ? 'text-amber-300' : isUnlocked ? 'text-slate-200' : 'text-slate-500'}`}>{stage}</span>
                                    {isCurrent && <span className="text-[10px] uppercase font-bold bg-emerald-900/50 text-emerald-400 px-2 py-0.5 rounded border border-emerald-700/50">Current</span>}
                                    {isPreviewing && !isCurrent && <span className="text-[10px] uppercase font-bold bg-amber-900/50 text-amber-400 px-2 py-0.5 rounded border border-amber-700/50">Previewing</span>}
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    {stage === 'egg' ? 'The beginning of potential.' :
                                     stage === 'baby' ? 'Small, curious, and needs care.' :
                                     stage === 'teen' ? 'Growing power, growing attitude.' :
                                     stage === 'adult' ? 'Fully realized power.' : 'Legendary status.'}
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>
            {previewStage && previewStage !== activeDragon.stage && (
                 <div className="mt-auto pt-6 text-center animate-in fade-in">
                     <p className="text-slate-500 text-sm mb-2">Previewing {previewStage} Form</p>
                     <button 
                        onClick={() => setPreviewStage(null)}
                        className="text-indigo-400 text-xs font-bold uppercase tracking-wider hover:text-white hover:underline"
                     >
                         Reset View
                     </button>
                 </div>
            )}
        </div>
    );
  };

  const renderDashboard = () => (
    <div className="p-6 max-w-xl mx-auto pb-24">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Dragon Haven</h1>
          <p className="text-slate-400 text-base mt-1">Focus to train your companions</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-800 px-5 py-3 rounded-full border border-slate-700">
          <Award className="text-amber-400" size={24} />
          <span className="font-bold text-slate-100 text-lg">{state.userPoints}</span>
        </div>
      </header>
      <div className="grid grid-cols-2 gap-6">
        {state.dragons.map(dragon => {
          const mood = getDragonMood(dragon);
          const colorClass = getTypeColor(dragon.type);
          const moodClass = getMoodColor(mood);
          let iconSize = 28;
          let containerClass = "w-20 h-20 ring-4";
          if (dragon.stage === 'baby') { iconSize = 32; containerClass = "w-20 h-20 ring-4"; }
          else if (dragon.stage === 'teen') { iconSize = 40; containerClass = "w-24 h-24 ring-[5px]"; }
          else if (dragon.stage === 'adult') { iconSize = 48; containerClass = "w-28 h-28 ring-[6px]"; }
          else if (dragon.stage === 'ancient') { iconSize = 56; containerClass = "w-28 h-28 ring-[6px] shadow-amber-500/20"; }

          const isHibernating = dragon.isNapping || mood === 'hibernating';
          const moodText = isHibernating ? 'Hibernating' : (mood === 'content' ? 'Happy' : 'Needs Attention');

          return (
            <div
              key={dragon.id}
              className={`relative group bg-slate-800 rounded-3xl border border-slate-700 hover:border-slate-500 transition-all text-left shadow-lg overflow-hidden flex flex-col items-center justify-between min-h-[260px] cursor-pointer`}
              onClick={() => handleSelectDragon(dragon.id)}
            >
              <div className="w-full">
                <div className={`flex justify-between p-3 opacity-70 group-hover:opacity-100 transition-opacity`}>
                    {/* Top Left Label: Habit vs Project */}
                    <div>
                        {dragon.isHabit ? (
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-900/50 text-indigo-300 border border-indigo-500/30 flex items-center gap-1 shadow-sm">Habit</span>
                        ) : (
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-900/50 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 shadow-sm">Project</span>
                        )}
                    </div>
                    {/* Top Right Label: Stage */}
                    <div className="flex flex-col items-end gap-1">
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-900/50 text-slate-300 flex items-center gap-1`}>
                        {(dragon.stage === 'adult' || dragon.stage === 'ancient') && <Crown size={12} className="text-amber-400" />}
                        {dragon.stage}
                        </span>
                    </div>
                </div>
                
                <div className="flex flex-col items-center mt-2">
                    <div className={`${containerClass} rounded-full flex items-center justify-center ${moodClass} transition-all duration-500 bg-slate-900 overflow-hidden`}>
                        <DragonIcon type={dragon.type} stage={dragon.stage} size={iconSize * (dragon.stage === 'egg' ? 1.5 : 1)} className={colorClass.split(' ')[0]} imageUrl={dragon.imageUrl} />
                    </div>
                    <div className="w-full text-center mt-4 px-4">
                        <h3 className="font-bold text-xl text-slate-100 leading-tight">{dragon.name}</h3>
                        <p className="text-sm text-slate-400 font-medium truncate mt-1">{dragon.subtitle || "Unassigned Quest"}</p>
                        <div className="flex justify-center items-center gap-2 text-xs font-bold uppercase tracking-wider mt-3">
                        {isHibernating ? (
                            <span className="flex items-center gap-1 text-indigo-400"><Moon size={12}/> Hibernating</span>
                        ) : (
                            <span className={mood === 'content' ? 'text-emerald-400' : 'text-amber-400'}>{moodText}</span>
                        )}
                        </div>
                    </div>
                </div>
              </div>

              <div className="w-full p-4 mt-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleNap(dragon.id); }}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${isHibernating ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-slate-900 hover:bg-slate-700 text-slate-400 hover:text-white'}`}
                  >
                      {isHibernating ? <Sun size={14} /> : <Moon size={14} />}
                      {isHibernating ? 'Wake Up' : 'Hibernate'}
                  </button>
              </div>
            </div>
          );
        })}
        <button
          onClick={() => setView('STORE')}
          className="bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-3xl p-6 flex flex-col items-center justify-center gap-4 text-slate-500 hover:text-emerald-400 hover:border-emerald-500/50 transition-all group min-h-[260px]"
        >
          <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Lock size={24} />
          </div>
          <span className="font-bold text-base">Unlock Egg</span>
        </button>
      </div>
    </div>
  );

  const renderDetail = () => {
    if (!activeDragon) return null;
    
    // --- TIMER VIEW (MODAL OVERLAY) ---
    if (sessionStep === 'TIMER') {
        return (
            <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col animate-in fade-in zoom-in-95 duration-300">
                 <div className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-3xl mx-auto relative">
                    <FocusTimer durationMinutes={sessionDuration} onComplete={completeSession} onCancel={cancelSession} dragon={activeDragon} />
                    {activeDragon.tasks.length > 0 && (
                        <div className="mt-8 w-full max-w-md bg-slate-900/80 backdrop-blur rounded-2xl p-6 border border-slate-800 shadow-2xl flex-1 max-h-[40vh] flex flex-col">
                            <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4 text-center sticky top-0 bg-transparent">Current Milestones</h4>
                             <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                                {renderTaskList(true)} 
                             </div>
                        </div>
                    )}
                 </div>
            </div>
        );
    }
    
    const mood = getDragonMood(activeDragon);
    const moodClass = getMoodColor(mood);
    const colorClass = getTypeColor(activeDragon.type);
    let avatarSize = 60;
    let ringWidth = "ring-8";
    
    // Logic to determine what stage to show in the big circle
    const displayStage = (detailTab === 'EVOLUTION' && previewStage) ? previewStage : activeDragon.stage;
    
    if (displayStage === 'baby') { avatarSize = 80; }
    else if (displayStage === 'teen') { avatarSize = 100; ringWidth = "ring-[10px]"; }
    else if (displayStage === 'adult') { avatarSize = 120; ringWidth = "ring-[12px]"; }
    else if (displayStage === 'ancient') { avatarSize = 130; ringWidth = "ring-[4px] border-4 border-amber-500"; }
    
    const evoConfig = activeDragon.evolutionConfig || { type: 'time', thresholds: DEFAULT_THRESHOLDS };
    const currentMetric = evoConfig.type === 'streak' ? activeDragon.currentStreak : activeDragon.totalFocusMinutes;
    const thresholds = evoConfig.thresholds;
    let nextThreshold = thresholds.baby;
    let prevThreshold = 0;
    if (activeDragon.stage === 'baby') { nextThreshold = thresholds.teen; prevThreshold = thresholds.baby; } 
    else if (activeDragon.stage === 'teen') { nextThreshold = thresholds.adult; prevThreshold = thresholds.teen; }
    const currentStageProgress = currentMetric - prevThreshold;
    const stageLength = nextThreshold - prevThreshold;
    const progressPercent = (activeDragon.stage === 'adult' || activeDragon.stage === 'ancient') ? 100 : Math.min(100, Math.max(0, (currentStageProgress / stageLength) * 100));
    
    const isHibernating = activeDragon.isNapping || mood === 'hibernating';
    const moodText = isHibernating ? 'Hibernating' : (mood === 'content' ? 'Happy' : 'Needs Attention');

    return (
      <div className="min-h-screen bg-slate-950 flex flex-col relative overflow-hidden">
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 opacity-20 blur-3xl rounded-full pointer-events-none ${colorClass.split(' ')[0].replace('text-', 'bg-')}`}></div>
        <div className="p-6 z-10 flex-1 flex flex-col h-full max-w-6xl mx-auto w-full">
          <nav className="flex justify-between items-center mb-8">
            <button onClick={() => setView('DASHBOARD')} className="p-3 rounded-full bg-slate-900/50 text-slate-300 hover:bg-slate-800"><ArrowLeft size={28} /></button>
            <div className="flex gap-3">
                 <button onClick={() => setShowImageModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-900/50 border border-purple-700/50 text-sm text-purple-200 font-bold hover:bg-purple-800/50 transition-colors"><ImageIcon size={16} /> Portrait</button>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-700 text-sm text-slate-400 font-mono">
                  {evoConfig.type === 'streak' ? <Flame size={14} className="text-orange-400"/> : <Zap size={14} className="text-blue-400"/>}
                  {currentMetric}{evoConfig.type === 'streak' ? ' day streak' : 'm'}
                </div>
            </div>
          </nav>
          <div className="flex flex-col lg:flex-row gap-10">
            <div className={`flex-1 flex flex-col items-center justify-center transition-all`}>
                <div className={`relative transition-all duration-700 ${isHibernating ? 'scale-90 opacity-80 grayscale-[0.5]' : 'scale-100'}`}>
                {isHibernating && (
                    <div className="absolute -inset-8 bg-indigo-500/10 backdrop-blur-[2px] border border-indigo-500/20 rounded-full z-20 flex items-center justify-center animate-pulse-slow">
                    <Moon className="text-indigo-200 opacity-50 mb-12" size={48} />
                    </div>
                )}
                <div className={`rounded-full bg-slate-900 flex items-center justify-center ${ringWidth} ${moodClass} shadow-2xl relative z-10 transition-all duration-500 overflow-hidden`} style={{ width: avatarSize * 2.2, height: avatarSize * 2.2 }}>
                    <DragonIcon 
                        type={activeDragon.type} 
                        stage={displayStage} 
                        size={avatarSize} 
                        className={`${colorClass.split(' ')[0]} filter drop-shadow-lg`} 
                        imageUrl={activeDragon.imageUrl} 
                    />
                    {(displayStage === 'adult' || displayStage === 'ancient') && (
                    <Crown className="absolute -top-6 text-amber-400 drop-shadow-md animate-bounce-subtle" size={32} />
                    )}
                </div>
                {!isHibernating && mood === 'eager' && (
                    <div className="absolute -right-4 -top-4 bg-amber-500 text-slate-900 p-2 rounded-full animate-bounce shadow-lg z-30"><Zap size={20} /></div>
                )}
                </div>
               
                {isEditingInfo ? (
                    <div className="mt-8 bg-slate-900/90 border border-slate-700 p-6 rounded-2xl w-full max-w-md animate-in fade-in zoom-in-95 max-h-[500px] overflow-y-auto custom-scrollbar shadow-xl">
                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-4 sticky top-0 bg-slate-900 pb-2">Edit Dragon Info</h4>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-slate-400 block mb-1.5 font-bold">Name</label>
                                <input className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-base text-white focus:outline-none focus:border-indigo-500" value={editName} onChange={(e) => setEditName(e.target.value)} />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 block mb-1.5 font-bold">Quest / Goal</label>
                                <input className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-base text-white focus:outline-none focus:border-indigo-500" value={editSubtitle} onChange={(e) => setEditSubtitle(e.target.value)} placeholder="e.g. Learn Spanish" />
                            </div>
                            <label className="flex items-center gap-3 cursor-pointer bg-slate-800/50 p-3 rounded-xl hover:bg-slate-800">
                                <input type="checkbox" checked={editIsHabit} onChange={(e) => setEditIsHabit(e.target.checked)} className="w-5 h-5 rounded bg-slate-800 border-slate-600 text-indigo-500 focus:ring-indigo-500" />
                                <span className="text-base text-slate-300">Daily Habit Mode</span>
                            </label>
                            <div className="border-t border-slate-700 pt-4 mt-2">
                                <label className="text-xs font-bold text-slate-500 uppercase block mb-3">Evolution Rules</label>
                                <div className="flex gap-3 mb-4">
                                    <button onClick={() => setEditEvolutionType('time')} className={`flex-1 py-2 text-sm font-bold rounded-xl border transition-colors ${editEvolutionType === 'time' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>Time Based</button>
                                    <button onClick={() => setEditEvolutionType('streak')} className={`flex-1 py-2 text-sm font-bold rounded-xl border transition-colors ${editEvolutionType === 'streak' ? 'bg-orange-600 border-orange-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>Streak Based</button>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div><label className="text-[10px] text-slate-500 block mb-1 font-bold uppercase">Baby</label><input type="number" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm" value={editThresholds.baby} onChange={e => setEditThresholds({...editThresholds, baby: parseInt(e.target.value)||0})}/></div>
                                    <div><label className="text-[10px] text-slate-500 block mb-1 font-bold uppercase">Teen</label><input type="number" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm" value={editThresholds.teen} onChange={e => setEditThresholds({...editThresholds, teen: parseInt(e.target.value)||0})}/></div>
                                    <div><label className="text-[10px] text-slate-500 block mb-1 font-bold uppercase">Adult</label><input type="number" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm" value={editThresholds.adult} onChange={e => setEditThresholds({...editThresholds, adult: parseInt(e.target.value)||0})}/></div>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2 sticky bottom-0 bg-slate-900 pt-4">
                                <button onClick={saveDragonInfo} className="flex-1 py-3 bg-emerald-600 rounded-xl text-sm font-bold text-white hover:bg-emerald-500 shadow-lg">Save Changes</button>
                                <button onClick={() => setIsEditingInfo(false)} className="flex-1 py-3 bg-slate-700 rounded-xl text-sm font-bold text-slate-300 hover:bg-slate-600">Cancel</button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center mt-8 group relative">
                            <button onClick={startEditingInfo} className="absolute -right-10 top-2 opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-white bg-slate-800/50 rounded-lg transition-all"><Pencil size={16} /></button>
                            <h2 className="text-4xl font-bold text-white tracking-tight flex items-center justify-center gap-2">{activeDragon.name}</h2>
                        <p className="text-indigo-300 text-lg font-medium mt-1">{activeDragon.subtitle || "Unassigned Quest"}</p>
                            {activeDragon.isHabit && <p className="text-xs uppercase font-bold text-slate-500 mt-2 flex items-center justify-center gap-1"><Repeat size={12} /> Daily Habit</p>}
                    </div>
                )}
                <p className="text-slate-400 text-sm mt-4 uppercase tracking-widest font-semibold opacity-75">{isHibernating ? 'Hibernating' : moodText} {displayStage}</p>
                {activeDragon.stage !== 'ancient' && (
                    <div className="w-64 mt-6">
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                    <p className="text-xs text-center mt-2 text-slate-500 font-mono">{Math.round(currentStageProgress)} / {stageLength} {evoConfig.type === 'streak' ? 'streak days' : 'mins'} to evolve</p>
                    </div>
                )}
                    {activeDragon.stage === 'adult' && (
                    <button onClick={manualCompleteProject} className="mt-8 px-5 py-2.5 bg-amber-900/30 border border-amber-600/50 text-amber-400 text-xs rounded-xl uppercase tracking-wider font-bold hover:bg-amber-900/50 transition-colors">Mark Project Complete</button>
                )}
            </div>

            <div className={`flex-1 flex flex-col bg-slate-900 border-t border-slate-800 lg:border lg:rounded-3xl lg:p-8 -mx-6 px-6 py-8 rounded-t-3xl shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.5)] min-h-[500px]`}>
                {!isHibernating ? (
                <>
                    {sessionStep === 'PRE' && (
                         <div className="flex gap-6 mb-8 border-b border-slate-800 pb-2">
                             <button onClick={() => setDetailTab('FOCUS')} className={`pb-3 text-base font-bold transition-all ${detailTab === 'FOCUS' ? 'text-white border-b-2 border-emerald-500' : 'text-slate-500 hover:text-slate-300'}`}>Today's Quest</button>
                             <button onClick={() => setDetailTab('CHRONICLES')} className={`pb-3 text-base font-bold transition-all flex items-center gap-2 ${detailTab === 'CHRONICLES' ? 'text-white border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-300'}`}>Archives <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-full">{activeDragon.history.length}</span></button>
                             <button onClick={() => { setDetailTab('EVOLUTION'); setPreviewStage(activeDragon.stage); }} className={`pb-3 text-base font-bold transition-all flex items-center gap-2 ${detailTab === 'EVOLUTION' ? 'text-white border-b-2 border-amber-500' : 'text-slate-500 hover:text-slate-300'}`}>Evolution</button>
                             <div className="flex-1 flex justify-end items-center gap-3">
                                 <div className="relative group">
                                     <button className="p-2 text-slate-500 hover:text-slate-300 transition-colors">
                                         <Info size={18} />
                                     </button>
                                     <div className="absolute right-0 bottom-full mb-2 w-48 p-3 bg-slate-800 border border-slate-700 rounded-xl text-[10px] text-slate-400 shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 leading-relaxed">
                                         <span className="font-bold text-indigo-400 block mb-1 uppercase tracking-wider">Hibernation</span>
                                         Hibernation stops status decay and pauses progress. Dragons auto-hibernate after 7 days of inactivity.
                                     </div>
                                 </div>
                                 <button onClick={() => toggleNap(activeDragon.id)} className="flex items-center gap-2 px-5 py-2 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-300 transition-all">
                                     <Moon size={14} /> Hibernate
                                 </button>
                             </div>
                         </div>
                    )}
                    {detailTab === 'EVOLUTION' && sessionStep === 'PRE' && renderEvolutionTab()}
                    {detailTab === 'CHRONICLES' && sessionStep === 'PRE' ? (
                        renderChronicles()
                    ) : (
                        <>
                        {sessionStep === 'PRE' && detailTab === 'FOCUS' && (
                        <div className="space-y-6 animate-in slide-in-from-bottom-10 fade-in duration-300 flex-1 flex flex-col">
                            <div>
                                <div className="flex justify-between items-baseline mb-2 ml-1">
                                    <label className="block text-base font-bold text-slate-400">Session Goal or New Strategy</label>
                                </div>
                                <VoiceInput 
                                    value={intention}
                                    onChange={setIntention}
                                    onTranscript={(text) => setIntention(prev => prev + (prev ? ' ' : '') + text)}
                                    placeholder="E.g. Finalize the 100-page report..."
                                />
                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={handleGenerateMilestones}
                                        disabled={breakingDown || !intention.trim()}
                                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl shadow-lg flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto justify-center"
                                    >
                                        {breakingDown ? <Loader className="animate-spin" size={16} /> : <Sparkle size={16} />}
                                        {breakingDown ? "Strategizing..." : "Analyze & Plan"}
                                    </button>
                                </div>
                            </div>
                            
                            {/* Empty State / Task List Container */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar min-h-[200px]">
                                {(activeDragon.tasks.length > 0) ? (
                                    <div>
                                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2 sticky top-0 bg-slate-900 py-3 z-10">
                                            Strategic Milestones
                                            <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded text-[10px]">{activeDragon.tasks.filter(t => !t.isCompleted).length} Active</span>
                                        </h3>
                                        {renderTaskList()}
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center space-y-5 py-10 animate-in fade-in zoom-in-95">
                                        <div className="p-5 bg-slate-800/50 rounded-full mb-2">
                                            <ListTodo size={40} className="text-slate-500" />
                                        </div>
                                        <p className="text-slate-400 text-base font-medium">No milestones yet.</p>
                                        
                                        <button 
                                            onClick={() => addTask("New Milestone")}
                                            className="w-full py-5 bg-slate-800 hover:bg-slate-700 border-2 border-dashed border-slate-600 hover:border-indigo-500 text-slate-300 hover:text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-3 group text-base"
                                        >
                                            <div className="bg-slate-700 group-hover:bg-indigo-600 p-1.5 rounded-lg transition-colors text-white">
                                                <Plus size={20} />
                                            </div>
                                            Add Manual Milestone
                                        </button>
                                    </div>
                                )}
                            </div>
                            
                            {(activeDragon.tasks.length > 0) && (
                                <button 
                                onClick={() => addTask("New Milestone")}
                                className="w-full py-3 border border-dashed border-slate-700 text-slate-500 hover:text-slate-300 hover:border-slate-500 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Plus size={16} /> Add New Milestone
                                </button>
                            )}
                            
                            <div className="mt-auto space-y-4">
                                <div className="flex items-center justify-between bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50">
                                    <span className="text-xs font-bold text-slate-400 px-3 uppercase tracking-wider">Duration</span>
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => setSessionDuration(Math.max(5, sessionDuration - 5))} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400"><Minus size={18}/></button>
                                        <span className="text-xl font-bold font-mono w-14 text-center text-emerald-400">{sessionDuration}m</span>
                                        <button onClick={() => setSessionDuration(sessionDuration + 5)} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400"><Plus size={18}/></button>
                                    </div>
                                </div>
                                <button
                                    onClick={startSession}
                                    disabled={(!intention.trim() && activeDragon.tasks.length === 0)}
                                    className="w-full py-5 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl text-white font-bold text-xl shadow-lg shadow-emerald-900/20 hover:shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3"
                                >
                                    <Sword size={24} fill="currentColor" /> Start Quest
                                </button>
                            </div>
                        </div>
                        )}
                        
                        {sessionStep === 'POST' && (
                        <div className="space-y-8 animate-in slide-in-from-bottom-10 fade-in duration-300 py-4">
                            <div className="text-center">
                            <div className="inline-flex p-4 rounded-full bg-emerald-500/20 text-emerald-400 mb-4 ring-1 ring-emerald-500/50"><Check size={40} /></div>
                            <h3 className="text-3xl font-bold text-white mb-2">Quest Complete!</h3>
                            <p className="text-slate-400 text-base">Review your milestones before collecting rewards.</p>
                            </div>
                            <div className="bg-slate-950/50 rounded-2xl p-6 border border-slate-800 max-h-64 overflow-y-auto custom-scrollbar">
                                <h4 className="text-xs font-bold text-slate-500 uppercase mb-4">Check off what you finished</h4>
                                {renderTaskList()}
                            </div>
                            <div>
                            <label className="block text-base font-bold text-slate-400 mb-3 ml-1">Quick Reflection</label>
                            <VoiceInput 
                                value={reflection}
                                onChange={setReflection}
                                onTranscript={(text) => setReflection(prev => prev + (prev ? ' ' : '') + text)}
                                placeholder="Any breakthroughs or blockers?"
                            />
                            </div>
                            <button onClick={finalizeSession} className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-xl shadow-lg shadow-emerald-900/20 transition-all">Complete & Evolve (+10 XP)</button>
                        </div>
                        )}
                        </>
                    )}
                </>
                ) : (
                <div className="text-center py-20 text-slate-500 flex items-center justify-center h-full flex-col">
                    <p className="text-lg font-medium">Zzz... {activeDragon.name} is {activeDragon.isNapping ? 'hibernating' : 'sleeping due to neglect'}.</p>
                    <p className="text-sm mt-2 opacity-70">Training schedule paused. Wake them up to resume.</p>
                    <button onClick={() => toggleNap(activeDragon.id)} className="mt-8 px-10 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-lg font-bold shadow-lg transition-all flex items-center gap-3">
                        <Sun size={24} /> Wake Up
                    </button>
                </div>
                )}
            </div>
          </div>
        </div>
        {showImageModal && renderImageModalContent()}
        {showEvolutionModal && renderEvolutionModal()}
      </div>
    );
  }

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 font-sans selection:bg-indigo-500/30 text-base">
      {view === 'DASHBOARD' && renderDashboard()}
      {view === 'DETAIL' && renderDetail()}
      {view === 'STORE' && (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
          <div className="mb-8">
            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-slate-700 shadow-lg"><Lock size={40} className="text-slate-500" /></div>
            <h2 className="text-4xl font-bold text-white mb-3">The Dragon Nursery</h2>
            <p className="text-slate-400 text-lg max-w-sm mx-auto">Ancient eggs are kept here. Spend your focus points to adopt a new companion.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 w-full max-w-sm mb-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-slate-400 font-bold uppercase text-xs tracking-wider">Your Balance</span>
              <span className="text-amber-400 font-bold font-mono text-2xl flex items-center gap-2"><Award size={24} /> {state.userPoints}</span>
            </div>
            <button onClick={unlockDragon} disabled={state.userPoints < 100} className="w-full py-5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-2xl text-lg shadow-lg shadow-indigo-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 group">
              <Sparkles size={20} className="text-indigo-200 group-hover:animate-spin-slow" /> Summon Random Egg (100 Pts)
            </button>
          </div>
          <button onClick={() => setView('DASHBOARD')} className="text-slate-500 hover:text-white font-bold text-base transition-colors flex items-center gap-2 px-4 py-2 rounded-full hover:bg-slate-900"><ArrowLeft size={20} /> Return to Sanctuary</button>
        </div>
      )}
    </div>
  );
}
