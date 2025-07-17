import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Inbox, 
  Search, 
  FolderOpen, 
  Eye, 
  Play,
  ArrowRight,
  CheckCircle
} from 'lucide-react'
import { Task } from '@/types'
import { cn } from '@/lib/utils'

interface TodorantWorkflowProps {
  tasks: Task[]
  onMoveTaskToStage: (taskId: string, stage: Task['todorantStage']) => void
}

const workflowStages = [
  {
    id: 'capture' as const,
    name: 'Capture',
    description: 'Collect all tasks and ideas',
    icon: Inbox,
    color: 'bg-gray-100 text-gray-700 border-gray-200'
  },
  {
    id: 'clarify' as const,
    name: 'Clarify',
    description: 'Define what each task means',
    icon: Search,
    color: 'bg-blue-100 text-blue-700 border-blue-200'
  },
  {
    id: 'organize' as const,
    name: 'Organize',
    description: 'Sort by context and priority',
    icon: FolderOpen,
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200'
  },
  {
    id: 'reflect' as const,
    name: 'Reflect',
    description: 'Review and plan your approach',
    icon: Eye,
    color: 'bg-purple-100 text-purple-700 border-purple-200'
  },
  {
    id: 'engage' as const,
    name: 'Engage',
    description: 'Take action on your tasks',
    icon: Play,
    color: 'bg-green-100 text-green-700 border-green-200'
  }
]

export function TodorantWorkflow({ tasks, onMoveTaskToStage }: TodorantWorkflowProps) {
  const [activeStage, setActiveStage] = useState<Task['todorantStage']>('capture')

  const getTasksByStage = (stage: Task['todorantStage']) => {
    return tasks.filter(task => task.todorantStage === stage && task.status !== 'completed')
  }

  const getTotalProgress = () => {
    const totalTasks = tasks.filter(task => task.status !== 'completed').length
    const completedStages = tasks.filter(task => 
      task.todorantStage === 'engage' && task.status !== 'completed'
    ).length
    return totalTasks > 0 ? (completedStages / totalTasks) * 100 : 0
  }

  const currentStageTasks = getTasksByStage(activeStage)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Todorant Workflow</h2>
          <p className="text-gray-600 mt-1">
            A structured approach to task management: Capture → Clarify → Organize → Reflect → Engage
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500 mb-1">Overall Progress</div>
          <Progress value={getTotalProgress()} className="w-32" />
        </div>
      </div>

      {/* Workflow Stages */}
      <div className="grid grid-cols-5 gap-4">
        {workflowStages.map((stage, index) => {
          const stageTasks = getTasksByStage(stage.id)
          const isActive = activeStage === stage.id
          
          return (
            <Card
              key={stage.id}
              className={cn(
                "p-4 cursor-pointer transition-all duration-200 border-2 relative",
                isActive ? stage.color : "hover:shadow-md"
              )}
              onClick={() => setActiveStage(stage.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <stage.icon className="h-5 w-5" />
                <Badge variant="secondary" className="text-xs">
                  {stageTasks.length}
                </Badge>
              </div>
              <h3 className="font-semibold text-sm mb-1">{stage.name}</h3>
              <p className="text-xs text-gray-600 leading-tight">
                {stage.description}
              </p>
              {index < workflowStages.length - 1 && (
                <ArrowRight className="h-4 w-4 text-gray-400 absolute -right-2 top-1/2 transform -translate-y-1/2" />
              )}
            </Card>
          )
        })}
      </div>

      {/* Active Stage Details */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {(() => {
              const stage = workflowStages.find(s => s.id === activeStage)!
              return (
                <>
                  <stage.icon className="h-6 w-6" />
                  <div>
                    <h3 className="text-lg font-semibold">{stage.name}</h3>
                    <p className="text-sm text-gray-600">{stage.description}</p>
                  </div>
                </>
              )
            })()}
          </div>
          <Badge variant="outline" className="text-sm">
            {currentStageTasks.length} tasks
          </Badge>
        </div>

        {/* Stage Tasks */}
        <div className="space-y-2">
          {currentStageTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No tasks in this stage</p>
            </div>
          ) : (
            currentStageTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{task.title}</h4>
                  {task.description && (
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {activeStage !== 'engage' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const currentIndex = workflowStages.findIndex(s => s.id === activeStage)
                        const nextStage = workflowStages[currentIndex + 1]
                        if (nextStage) {
                          onMoveTaskToStage(task.id, nextStage.id)
                        }
                      }}
                    >
                      Next Stage
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  )}
                  {activeStage === 'engage' && (
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => onMoveTaskToStage(task.id, 'engage')}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Start Task
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Stage Actions */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {activeStage === 'capture' && "Collect all your tasks and ideas without judgment"}
              {activeStage === 'clarify' && "Define what each task means and what success looks like"}
              {activeStage === 'organize' && "Group tasks by context, priority, and timeline"}
              {activeStage === 'reflect' && "Review your tasks and plan your approach"}
              {activeStage === 'engage' && "Take focused action on your most important tasks"}
            </div>
            <Button variant="outline" size="sm">
              Stage Guide
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}