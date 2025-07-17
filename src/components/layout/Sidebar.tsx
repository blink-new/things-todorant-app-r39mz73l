import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Inbox, 
  Calendar, 
  Clock, 
  Archive, 
  Plus,
  Search,
  Settings,
  Workflow
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  activeView: string
  onViewChange: (view: string) => void
  taskCounts: {
    inbox: number
    today: number
    upcoming: number
    someday: number
  }
  onQuickAdd?: () => void
}

export function Sidebar({ activeView, onViewChange, taskCounts, onQuickAdd }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems = [
    { id: 'inbox', label: 'Inbox', icon: Inbox, count: taskCounts.inbox },
    { id: 'today', label: 'Today', icon: Calendar, count: taskCounts.today },
    { id: 'upcoming', label: 'Upcoming', icon: Clock, count: taskCounts.upcoming },
    { id: 'someday', label: 'Someday', icon: Archive, count: taskCounts.someday },
  ]

  return (
    <div className={cn(
      "bg-gray-50 border-r border-gray-200 flex flex-col transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h1 className="text-xl font-semibold text-gray-900">Things</h1>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 p-0"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Quick Add */}
      <div className="p-4">
        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-white"
          size={isCollapsed ? "sm" : "default"}
          onClick={onQuickAdd}
        >
          <Plus className="h-4 w-4" />
          {!isCollapsed && <span className="ml-2">Quick Add</span>}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activeView === item.id ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start h-10",
                activeView === item.id && "bg-primary/10 text-primary"
              )}
              onClick={() => onViewChange(item.id)}
            >
              <item.icon className="h-4 w-4" />
              {!isCollapsed && (
                <>
                  <span className="ml-3">{item.label}</span>
                  {item.count > 0 && (
                    <Badge 
                      variant="secondary" 
                      className="ml-auto bg-gray-200 text-gray-700"
                    >
                      {item.count}
                    </Badge>
                  )}
                </>
              )}
            </Button>
          ))}
        </div>

        {/* Todorant Workflow Section */}
        <div className="mt-8">
          {!isCollapsed && (
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Todorant Workflow
            </h3>
          )}
          <Button
            variant={activeView === 'todorant' ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start h-10",
              activeView === 'todorant' && "bg-accent/10 text-accent"
            )}
            onClick={() => onViewChange('todorant')}
          >
            <Workflow className="h-4 w-4" />
            {!isCollapsed && <span className="ml-3">Workflow</span>}
          </Button>
        </div>
      </nav>

      {/* Settings */}
      <div className="p-2 border-t border-gray-200">
        <Button
          variant="ghost"
          className="w-full justify-start h-10"
          onClick={() => onViewChange('settings')}
        >
          <Settings className="h-4 w-4" />
          {!isCollapsed && <span className="ml-3">Settings</span>}
        </Button>
      </div>
    </div>
  )
}