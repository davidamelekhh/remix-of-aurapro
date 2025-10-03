import { Navigation } from '@/components/layout/Navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, Send, Paperclip } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const conversations = [
  {
    id: 1,
    name: 'Mohammed Ben Ahmed',
    project: 'Résidence Al Andalus',
    lastMessage: 'Merci pour la mise à jour',
    time: '14:30',
    unread: 2,
    initials: 'MA',
  },
  {
    id: 2,
    name: 'Fatima El Mansouri',
    project: 'Villa Moderne Rabat',
    lastMessage: 'Parfait ! Pouvez-vous m\'envoyer les photos ?',
    time: '11:22',
    unread: 0,
    initials: 'FE',
  },
  {
    id: 3,
    name: 'Omar Benali',
    project: 'Complex Marrakech Gardens',
    lastMessage: 'Quand pourrons-nous reprendre les travaux ?',
    time: 'Hier',
    unread: 1,
    initials: 'OB',
  },
  {
    id: 4,
    name: 'Youssef Benjelloun',
    project: 'Appartement Tanger Bay',
    lastMessage: 'Les plans sont approuvés',
    time: '2j',
    unread: 0,
    initials: 'YB',
  },
];

const currentMessages = [
  {
    id: 1,
    sender: 'Mohammed Ben Ahmed',
    message: 'Bonjour, pourriez-vous me donner une mise à jour sur l\'avancement ?',
    time: '13:45',
    fromMe: false,
  },
  {
    id: 2,
    sender: 'Vous',
    message: 'Bonjour ! Les travaux de structure sont terminés à 75%. Nous sommes dans les temps.',
    time: '14:15',
    fromMe: true,
  },
  {
    id: 3,
    sender: 'Mohammed Ben Ahmed',
    message: 'Merci pour la mise à jour',
    time: '14:30',
    fromMe: false,
  },
];

export default function Messages() {
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [newMessage, setNewMessage] = useState('');

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-foreground">Messages</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 h-[600px]">
            {/* Conversations List */}
            <Card className="p-4 overflow-y-auto">
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                  <Input
                    type="text"
                    placeholder="Rechercher..."
                    className="pl-10"
                  />
                </div>

                <div className="space-y-2">
                  {conversations.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedConversation === conv.id
                          ? 'bg-foreground text-background'
                          : 'hover:bg-secondary'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10 flex-shrink-0">
                          <AvatarFallback className={selectedConversation === conv.id ? 'bg-background text-foreground' : 'bg-secondary text-foreground'}>
                            {conv.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-semibold truncate">
                              {conv.name}
                            </span>
                            {conv.unread > 0 && (
                              <Badge className="ml-2 bg-success text-background">
                                {conv.unread}
                              </Badge>
                            )}
                          </div>
                          <p className={`text-xs font-light truncate ${
                            selectedConversation === conv.id ? 'text-background/70' : 'text-muted-foreground'
                          }`}>
                            {conv.project}
                          </p>
                          <p className={`text-xs mt-1 truncate ${
                            selectedConversation === conv.id ? 'text-background/60' : 'text-muted-foreground'
                          }`}>
                            {conv.lastMessage}
                          </p>
                        </div>
                        <span className={`text-xs flex-shrink-0 ${
                          selectedConversation === conv.id ? 'text-background/60' : 'text-muted-foreground'
                        }`}>
                          {conv.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Chat Area */}
            <Card className="lg:col-span-2 flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-secondary text-foreground">MA</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-foreground">Mohammed Ben Ahmed</h3>
                    <p className="text-xs text-muted-foreground font-light">Résidence Al Andalus</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {currentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.fromMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        msg.fromMe
                          ? 'bg-foreground text-background'
                          : 'bg-secondary text-foreground'
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <span className={`text-xs mt-1 block ${
                        msg.fromMe ? 'text-background/60' : 'text-muted-foreground'
                      }`}>
                        {msg.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="flex-shrink-0">
                    <Paperclip className="h-4 w-4" strokeWidth={1.5} />
                  </Button>
                  <Textarea
                    placeholder="Écrire un message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="resize-none min-h-[44px] max-h-[120px]"
                    rows={1}
                  />
                  <Button size="icon" className="flex-shrink-0">
                    <Send className="h-4 w-4" strokeWidth={1.5} />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
