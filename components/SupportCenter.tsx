import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, Loader2, Phone, Mail, MessageCircle } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { fetchAllProducts } from '../lib/shopify';
import { Product } from '../types';
import { APP_NAME, CONTACT_PHONE, CONTACT_EMAIL, CATEGORIES } from '../constants';

// Environment Variables
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;
const GEMINI_MODEL = (import.meta.env.VITE_GEMINI_MODEL as string) || 'gemini-1.5-flash';
const GEMINI_FALLBACK_MODEL = 'gemini-2.0-flash';

interface Message {
  role: 'user' | 'model';
  content: string;
}

const SupportCenter: React.FC = () => {
  const [isCenterOpen, setIsCenterOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: `Hello! I'm the ${APP_NAME} AI assistant. How can I help you with our medical equipment today?` }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load product data from Shopify
  useEffect(() => {
    fetchAllProducts().then(setProducts).catch(console.error);
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isChatOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    if (!GEMINI_API_KEY) {
      setMessages(prev => [...prev, { role: 'model', content: "API Key missing in environment." }]);
      return;
    }

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      
      const productContext = products.map(p => 
        `- ${p.title}: ₹${p.price} (Category: ${p.category})`
      ).join('\n');

      const systemPrompt = `
        You are the official AI assistant for ${APP_NAME}.
        Store Info:
        - Support: ${CONTACT_PHONE}, ${CONTACT_EMAIL}
        - Categories: ${CATEGORIES.map(c => c.name).join(', ')}
        - Knowledge Base:
        ${productContext}

        Strict Rules:
        1. ONLY answer questions related to ${APP_NAME} and the medical products listed above.
        2. If asked about anything else (politics, general knowledge, other stores), politely say: "I am designed to assist only with ${APP_NAME} products and services."
        3. Be professional, concise, and prioritize using the pricing from the Knowledge Base.
      `;

      const chatHistory = messages
        .filter((_, index) => index !== 0) 
        .map(m => ({
          role: m.role,
          parts: [{ text: m.content }],
        }));

      const runChat = async (modelName: string) => {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: systemPrompt
        });
        const chat = model.startChat({ history: chatHistory });
        const result = await chat.sendMessage(userMessage);
        const response = await result.response;
        return response.text();
      };

      let replyText: string;
      try {
        replyText = await runChat(GEMINI_MODEL);
      } catch (error: any) {
        // Fallback logic for model versions
        const is404 = error?.message?.includes('not found') || error?.message?.includes('[404');
        if (is404 && GEMINI_MODEL !== GEMINI_FALLBACK_MODEL) {
          replyText = await runChat(GEMINI_FALLBACK_MODEL);
        } else {
          throw error;
        }
      }

      setMessages(prev => [...prev, { role: 'model', content: replyText }]);
    } catch (error: any) {
      let errorMessage = "Connection trouble. Please try again or use WhatsApp.";
      if (error.message?.includes("429")) errorMessage = "Daily chat limit reached. Please wait or call support.";
      setMessages(prev => [...prev, { role: 'model', content: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 font-sans">
      {/* 1. AI Chat Window */}
      {isChatOpen && (
        <div className="bg-white w-[350px] sm:w-[400px] h-[500px] shadow-2xl rounded-2xl flex flex-col border border-gray-200 overflow-hidden mb-2 animate-in slide-in-from-bottom-5">
          <div className="bg-medical-primary p-4 flex justify-between items-center text-white shadow-md">
            <div className="flex items-center gap-3">
              <Bot size={20} />
              <div>
                <p className="font-bold text-sm leading-none">${APP_NAME} AI</p>
                <p className="text-[10px] opacity-80 mt-1 text-white/70">Secure Support</p>
              </div>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="hover:bg-white/20 p-1 rounded-full"><X size={20} /></button>
          </div>
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                  msg.role === 'user' ? 'bg-medical-primary text-white rounded-tr-none' : 'bg-white border text-gray-800 rounded-tl-none'
                }`}>
                  <p className="whitespace-pre-line">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && <Loader2 className="animate-spin text-medical-primary mx-auto" />}
          </div>

          <div className="p-4 bg-white border-t flex gap-2">
            <input 
              className="flex-1 text-sm border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-medical-primary/20 outline-none"
              placeholder="Ask about BiPAP, Oxygen..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} disabled={isLoading} className="bg-medical-primary text-white p-2.5 rounded-xl disabled:opacity-50">
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {/* 2. Floating Action Menu */}
      <div className="flex flex-col items-end gap-3">
        {isCenterOpen && (
          <div className="flex flex-col items-end gap-3 mb-2">
            {/* WhatsApp Link */}
            <a 
              href={`https://wa.me/${CONTACT_PHONE.replace(/\D/g, '')}`} 
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 bg-green-500 text-white px-5 py-2.5 rounded-full shadow-lg hover:bg-green-600 transition-all scale-in-center"
            >
              <span className="text-sm font-bold">WhatsApp</span>
              <MessageCircle size={20} />
            </a>

            {/* Open AI Bot */}
            <button 
              onClick={() => { setIsChatOpen(true); setIsCenterOpen(false); }}
              className="flex items-center gap-3 bg-medical-primary text-white px-5 py-2.5 rounded-full shadow-lg hover:bg-medical-dark transition-all scale-in-center"
            >
              <span className="text-sm font-bold">Ask AI Bot</span>
              <Bot size={20} />
            </button>
          </div>
        )}

        {/* Main Support Trigger */}
        <button 
          onClick={() => setIsCenterOpen(!isCenterOpen)}
          className={`p-4 rounded-full shadow-2xl transition-all duration-300 ${isCenterOpen ? 'bg-gray-800 rotate-90' : 'bg-medical-primary hover:scale-110'}`}
        >
          {isCenterOpen ? <X size={28} className="text-white" /> : <MessageSquare size={28} className="text-white" />}
        </button>
      </div>
    </div>
  );
};

export default SupportCenter;