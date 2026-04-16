import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { PropertyCard } from "@/components/property-card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSendChatMessage, Property } from "@workspace/api-client-react";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  properties?: Property[];
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      content: "Hello! I'm your Estate AI assistant. I can help you find properties in DHA, Bahria Town, Gulberg, and other prime locations in Pakistan. What kind of property are you looking for?",
    }
  ]);
  const [input, setInput] = useState("");
  const [sessionId] = useState(`sess_${Math.random().toString(36).substring(2, 9)}`);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const sendChat = useSendChatMessage();

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, sendChat.isPending]);

  const handleSend = () => {
    if (!input.trim() || sendChat.isPending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");

    sendChat.mutate(
      {
        data: {
          message: userMessage.content,
          sessionId: sessionId,
        }
      },
      {
        onSuccess: (response) => {
          const aiMessage: Message = {
            id: Date.now().toString(),
            role: "ai",
            content: response.message,
            properties: response.properties,
          };
          setMessages(prev => [...prev, aiMessage]);
        }
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-accent/30 relative">
      <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-32" ref={scrollRef}>
        <div className="max-w-4xl mx-auto space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((message, idx) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center shadow-sm ${
                  message.role === "user" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-secondary text-secondary-foreground"
                }`}>
                  {message.role === "user" ? <User size={20} /> : <Bot size={20} />}
                </div>
                
                <div className={`flex flex-col max-w-[85%] ${message.role === "user" ? "items-end" : "items-start"}`}>
                  <div className={`px-4 py-3 rounded-2xl shadow-sm ${
                    message.role === "user" 
                      ? "bg-primary text-primary-foreground rounded-tr-none" 
                      : "bg-card border border-border text-card-foreground rounded-tl-none"
                  }`}>
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  </div>
                  
                  {message.properties && message.properties.length > 0 && (
                    <div className="mt-4 w-full">
                      <div className="flex overflow-x-auto pb-4 gap-4 snap-x snap-mandatory hide-scrollbar">
                        {message.properties.map((property, pIdx) => (
                          <motion.div 
                            key={property.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 * pIdx }}
                            className="snap-start shrink-0 w-72 md:w-80"
                          >
                            <PropertyCard 
                              property={property} 
                              isCompact 
                            />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            
            {sendChat.isPending && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4 flex-row"
              >
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center shadow-sm">
                  <Bot size={20} />
                </div>
                <div className="bg-card border border-border px-4 py-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Estate AI is thinking...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-border">
        <div className="max-w-4xl mx-auto relative">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="E.g., I'm looking for a 10 marla house in Bahria Town Phase 8 under 3 crore..."
            className="pr-14 resize-none rounded-xl bg-card border-input focus-visible:ring-primary min-h-[60px] shadow-sm py-3"
            rows={1}
          />
          <Button 
            size="icon" 
            className="absolute right-2 bottom-2 h-10 w-10 rounded-lg hover-elevate transition-all"
            onClick={handleSend}
            disabled={!input.trim() || sendChat.isPending}
          >
            <Send className="h-5 w-5" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
      
    </div>
  );
}
