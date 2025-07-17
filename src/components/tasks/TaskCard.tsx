import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Calendar, 
  Flag, 
  MoreHorizontal, 
  Tag,
  Clock
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Task } from '@/types'
import { cn } from '@/lib/utils'

interface TaskCardProps {
  task: Task
  onToggleComplete: (taskId: string) => void
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
}

export function TaskCard({ task, onToggleComplete, onEdit, onDelete }: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500'
      case 'medium': return 'text-yellow-500'
      case 'low': return 'text-blue-500'
      default: return 'text-gray-400'
    }
  }

  const getTodorantStageColor = (stage: string) => {
    switch (stage) {
      case 'capture': return 'bg-gray-100 text-gray-700'
      case 'clarify': return 'bg-blue-100 text-blue-700'
      case 'organize': return 'bg-yellow-100 text-yellow-700'
      case 'reflect': return 'bg-purple-100 text-purple-700'
      case 'engage': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return null
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow'
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
    }
  }

  return (
    <Card 
      className={cn(
        "p-4 transition-all duration-200 hover:shadow-md cursor-pointer",
        task.status === 'completed' && "opacity-60"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onEdit(task)}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <Checkbox
          checked={task.status === 'completed'}
          onCheckedChange={() => onToggleComplete(task.id)}
          onClick={(e) => e.stopPropagation()}
          className="mt-1"
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className={cn(
                "font-medium text-gray-900 mb-1",
                task.status === 'completed' && "line-through text-gray-500"
              )}>
                {task.title}
              </h3>
              
              {task.description && (
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {task.description}
                </p>
              )}

              {/* Metadata */}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                {task.dueDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(task.dueDate)}</span>
                  </div>
                )}
                
                {task.priority !== 'none' && (
                  <div className="flex items-center gap-1">
                    <Flag className={cn("h-3 w-3", getPriorityColor(task.priority))} />
                    <span className="capitalize">{task.priority}</span>
                  </div>
                )}

                {task.project && (
                  <div className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    <span>{task.project}</span>
                  </div>
                )}

                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <Badge 
                    variant="secondary" 
                    className={cn("text-xs", getTodorantStageColor(task.todorantStage))}
                  >
                    {task.todorantStage}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Actions */}
            {isHovered && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(task)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDelete(task.id)}
                    className="text-red-600"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}