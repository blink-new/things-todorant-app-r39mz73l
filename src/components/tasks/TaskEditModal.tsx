import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { CalendarIcon, Flag, Tag, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { Task } from '@/types'
import { cn } from '@/lib/utils'

interface TaskEditModalProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
  onSave: (task: Task) => void
}

export function TaskEditModal({ task, isOpen, onClose, onSave }: TaskEditModalProps) {
  const [formData, setFormData] = useState<Partial<Task>>({})
  const [dueDate, setDueDate] = useState<Date | undefined>()

  useEffect(() => {
    if (task) {
      setFormData(task)
      setDueDate(task.dueDate ? new Date(task.dueDate) : undefined)
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'inbox',
        priority: 'none',
        project: '',
        todorantStage: 'capture'
      })
      setDueDate(undefined)
    }
  }, [task])

  const handleSave = () => {
    if (!formData.title?.trim()) return

    const updatedTask: Task = {
      id: task?.id || Date.now().toString(),
      userId: task?.userId || 'user1',
      title: formData.title,
      description: formData.description || '',
      status: formData.status as Task['status'] || 'inbox',
      priority: formData.priority as Task['priority'] || 'none',
      dueDate: dueDate?.toISOString(),
      project: formData.project,
      todorantStage: formData.todorantStage as Task['todorantStage'] || 'capture',
      createdAt: task?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: task?.completedAt
    }

    onSave(updatedTask)
    onClose()
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500 border-red-200 bg-red-50'
      case 'medium': return 'text-yellow-500 border-yellow-200 bg-yellow-50'
      case 'low': return 'text-blue-500 border-blue-200 bg-blue-50'
      default: return 'text-gray-500 border-gray-200 bg-gray-50'
    }
  }

  const getTodorantStageColor = (stage: string) => {
    switch (stage) {
      case 'capture': return 'bg-gray-100 text-gray-700 border-gray-200'
      case 'clarify': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'organize': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'reflect': return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'engage': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Create Task'}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              placeholder="Enter task title..."
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="text-lg"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              placeholder="Add a description..."
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          {/* Status and Priority Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as Task['status'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inbox">📥 Inbox</SelectItem>
                  <SelectItem value="today">📅 Today</SelectItem>
                  <SelectItem value="upcoming">⏰ Upcoming</SelectItem>
                  <SelectItem value="someday">📦 Someday</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value as Task['priority'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">
                    <div className="flex items-center gap-2">
                      <Flag className="h-3 w-3 text-gray-400" />
                      None
                    </div>
                  </SelectItem>
                  <SelectItem value="low">
                    <div className="flex items-center gap-2">
                      <Flag className="h-3 w-3 text-blue-500" />
                      Low
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <Flag className="h-3 w-3 text-yellow-500" />
                      Medium
                    </div>
                  </SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      <Flag className="h-3 w-3 text-red-500" />
                      High
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Due Date and Project Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Due Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Project</label>
              <Input
                placeholder="Enter project name..."
                value={formData.project || ''}
                onChange={(e) => setFormData({ ...formData, project: e.target.value })}
              />
            </div>
          </div>

          {/* Todorant Stage */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Todorant Stage</label>
            <Select
              value={formData.todorantStage}
              onValueChange={(value) => setFormData({ ...formData, todorantStage: value as Task['todorantStage'] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="capture">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", getTodorantStageColor('capture'))} />
                    Capture
                  </div>
                </SelectItem>
                <SelectItem value="clarify">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", getTodorantStageColor('clarify'))} />
                    Clarify
                  </div>
                </SelectItem>
                <SelectItem value="organize">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", getTodorantStageColor('organize'))} />
                    Organize
                  </div>
                </SelectItem>
                <SelectItem value="reflect">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", getTodorantStageColor('reflect'))} />
                    Reflect
                  </div>
                </SelectItem>
                <SelectItem value="engage">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", getTodorantStageColor('engage'))} />
                    Engage
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Current Status Display */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Flag className={cn("h-4 w-4", getPriorityColor(formData.priority || 'none').split(' ')[0])} />
              <span className="text-sm capitalize">{formData.priority || 'none'} priority</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <Badge className={cn("text-xs", getTodorantStageColor(formData.todorantStage || 'capture'))}>
                {formData.todorantStage || 'capture'}
              </Badge>
            </div>
            {formData.project && (
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{formData.project}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!formData.title?.trim()}>
            {task ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}