"use client";

import React, { useState } from "react";
import { ModuleData } from "../../components/LearningModules";
import { Save, X, Plus, Trash2, ArrowLeft } from "lucide-react";

interface ModuleEditorProps {
  initialData: ModuleData | null;
  onSave: (data: ModuleData) => void;
  onCancel: () => void;
}

export default function ModuleEditor({ initialData, onSave, onCancel }: ModuleEditorProps) {
  const [formData, setFormData] = useState<ModuleData>(
    initialData || {
      id: `module-${Date.now()}`,
      title: "",
      subtitle: "",
      difficulty: "Beginner",
      readingTime: "3 min read",
      description: "",
      unlockCodeRequired: "",
      unlockedCodeReward: "",
      color: "teal",
      borderColor: "border-teal-200",
      bgColor: "bg-teal-50/50",
      accentColor: "bg-teal-500",
      content: {
        introduction: "",
        keyPoints: [],
        funFact: "",
        vocabulary: [],
        conclusion: ""
      }
    }
  );

  const handleBasicChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      content: { ...prev.content, [name]: value }
    }));
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const color = e.target.value;
    setFormData(prev => ({
      ...prev,
      color,
      borderColor: `border-${color}-200`,
      bgColor: `bg-${color}-50/50`,
      accentColor: `bg-${color}-500`,
    }));
  };

  const addKeyPoint = () => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        keyPoints: [...prev.content.keyPoints, { title: "", desc: "" }]
      }
    }));
  };

  const updateKeyPoint = (index: number, field: "title" | "desc", value: string) => {
    const newKPs = [...formData.content.keyPoints];
    newKPs[index][field] = value;
    setFormData(prev => ({
      ...prev,
      content: { ...prev.content, keyPoints: newKPs }
    }));
  };

  const removeKeyPoint = (index: number) => {
    const newKPs = [...formData.content.keyPoints];
    newKPs.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      content: { ...prev.content, keyPoints: newKPs }
    }));
  };

  const addVocab = () => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        vocabulary: [...prev.content.vocabulary, { word: "", definition: "" }]
      }
    }));
  };

  const updateVocab = (index: number, field: "word" | "definition", value: string) => {
    const newVocab = [...formData.content.vocabulary];
    newVocab[index][field] = value;
    setFormData(prev => ({
      ...prev,
      content: { ...prev.content, vocabulary: newVocab }
    }));
  };

  const removeVocab = (index: number) => {
    const newVocab = [...formData.content.vocabulary];
    newVocab.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      content: { ...prev.content, vocabulary: newVocab }
    }));
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <button onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-black text-slate-800">
              {initialData ? "Edit Module" : "Create New Module"}
            </h2>
            <p className="text-slate-500 font-bold text-xs">{formData.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onCancel} className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors">
            Cancel
          </button>
          <button 
            onClick={() => onSave(formData)}
            className="flex items-center gap-2 px-5 py-2.5 bg-theme-primary text-white font-extrabold rounded-xl shadow-sm hover:bg-theme-primary-hover transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Module
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Basic Details */}
        <div className="space-y-6">
          <section className="space-y-4">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Basic Details</h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Title</label>
                <input name="title" value={formData.title} onChange={handleBasicChange} className="w-full p-3 rounded-xl border border-slate-200 focus:border-theme-primary outline-none font-bold text-slate-800" placeholder="e.g. Ocean's Heartbeat" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Subtitle</label>
                <input name="subtitle" value={formData.subtitle} onChange={handleBasicChange} className="w-full p-3 rounded-xl border border-slate-200 focus:border-theme-primary outline-none text-slate-700" placeholder="e.g. Global Climate Regulation" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Description</label>
                <textarea name="description" value={formData.description} onChange={handleBasicChange} rows={3} className="w-full p-3 rounded-xl border border-slate-200 focus:border-theme-primary outline-none text-slate-700 text-sm" placeholder="Short description for the card..."></textarea>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Difficulty</label>
                  <select name="difficulty" value={formData.difficulty} onChange={handleBasicChange} className="w-full p-3 rounded-xl border border-slate-200 outline-none text-slate-700 font-bold">
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Read Time</label>
                  <input name="readingTime" value={formData.readingTime} onChange={handleBasicChange} className="w-full p-3 rounded-xl border border-slate-200 outline-none text-slate-700 font-bold" placeholder="e.g. 5 min read" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Color Theme</label>
                  <select name="color" value={formData.color} onChange={handleColorChange} className="w-full p-3 rounded-xl border border-slate-200 outline-none text-slate-700 font-bold">
                    <option value="teal">Teal (Primary)</option>
                    <option value="sky">Sky (Secondary)</option>
                    <option value="rose">Rose (Accent)</option>
                    <option value="indigo">Indigo</option>
                    <option value="amber">Amber</option>
                    <option value="emerald">Emerald</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Unlocking & Rewards</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Unlock Code Required (Optional)</label>
                <input name="unlockCodeRequired" value={formData.unlockCodeRequired || ""} onChange={handleBasicChange} className="w-full p-3 rounded-xl border border-slate-200 outline-none font-black text-slate-800 uppercase" placeholder="e.g. PREVIOUSCODE" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Reward Code on Finish</label>
                <input name="unlockedCodeReward" value={formData.unlockedCodeReward} onChange={handleBasicChange} className="w-full p-3 rounded-xl border border-theme-primary/30 outline-none font-black text-theme-primary uppercase" placeholder="e.g. NEWCODE" />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Lesson Intro & Outro</h3>
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">Introduction</label>
              <textarea name="introduction" value={formData.content.introduction} onChange={handleContentChange} rows={3} className="w-full p-3 rounded-xl border border-slate-200 outline-none text-slate-700 text-sm"></textarea>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">Conclusion</label>
              <textarea name="conclusion" value={formData.content.conclusion} onChange={handleContentChange} rows={2} className="w-full p-3 rounded-xl border border-slate-200 outline-none text-slate-700 text-sm"></textarea>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">Fun Fact (Highlighted Callout)</label>
              <textarea name="funFact" value={formData.content.funFact} onChange={handleContentChange} rows={2} className="w-full p-3 rounded-xl border border-amber-200 bg-amber-50 outline-none text-amber-900 text-sm font-semibold"></textarea>
            </div>
          </section>
        </div>

        {/* Right Column: Dynamic Arrays */}
        <div className="space-y-6">
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Key Discoveries (Points)</h3>
              <button onClick={addKeyPoint} className="text-xs font-bold text-theme-primary flex items-center gap-1 hover:text-theme-primary-dark">
                <Plus className="w-3.5 h-3.5" /> Add Point
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.content.keyPoints.map((kp, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl relative group">
                  <button onClick={() => removeKeyPoint(idx)} className="absolute top-2 right-2 p-1.5 bg-rose-100 text-rose-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Point {idx + 1}</label>
                  <input value={kp.title} onChange={(e) => updateKeyPoint(idx, "title", e.target.value)} className="w-full p-2 mb-2 rounded-lg border border-slate-200 font-bold text-sm" placeholder="Point Title" />
                  <textarea value={kp.desc} onChange={(e) => updateKeyPoint(idx, "desc", e.target.value)} rows={2} className="w-full p-2 rounded-lg border border-slate-200 text-sm text-slate-600" placeholder="Point description..."></textarea>
                </div>
              ))}
              {formData.content.keyPoints.length === 0 && <p className="text-xs text-slate-400 text-center py-4">No key points added yet.</p>}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Vocabulary Words</h3>
              <button onClick={addVocab} className="text-xs font-bold text-theme-primary flex items-center gap-1 hover:text-theme-primary-dark">
                <Plus className="w-3.5 h-3.5" /> Add Word
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.content.vocabulary.map((v, idx) => (
                <div key={idx} className="flex gap-2 items-start">
                  <input value={v.word} onChange={(e) => updateVocab(idx, "word", e.target.value)} className="w-1/3 p-2.5 rounded-xl border border-slate-200 font-bold text-sm" placeholder="Word" />
                  <input value={v.definition} onChange={(e) => updateVocab(idx, "definition", e.target.value)} className="flex-1 p-2.5 rounded-xl border border-slate-200 text-sm" placeholder="Definition..." />
                  <button onClick={() => removeVocab(idx)} className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-xl transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {formData.content.vocabulary.length === 0 && <p className="text-xs text-slate-400 text-center py-4">No vocabulary words added yet.</p>}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
