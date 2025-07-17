import { useState, useEffect } from 'react'
import { blink } from '@/lib/blink'
import { Sidebar } from '@/components/layout/Sidebar'
import { TaskList } from '@/components/tasks/TaskList'
import { TaskEditModal } from '@/components/tasks/TaskEditModal'
import { TodorantWorkflow } from '@/components/todorant/TodorantWorkflow'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search } from 'lucide-react'
import { Task } from '@/types'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'

// Mock data for development
const mockTasks: Task[] = [
    {
      id: '1',
      userId: 'user1',
      title: 'Review project proposal',
      description: 'Go through the Q4 project proposal and provide feedback',
      status: 'today',
      priority: 'high',
      dueDate: new Date().toISOString(),
      project: 'Work',
      todorantStage: 'clarify',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      userId: 'user1',
      title: 'Buy groceries',
      description: 'Milk, bread, eggs, and vegetables for the week',
      status: 'today',
      priority: 'medium',
      project: 'Personal',
      todorantStage: 'organize',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '3',
      userId: 'user1',
      title: 'Plan weekend trip',
      status: 'upcoming',
      priority: 'low',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      project: 'Personal',
      todorantStage: 'capture',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '4',
      userId: 'user1',
      title: 'Learn new programming language',
      status: 'someday',
      priority: 'medium',
      project: 'Learning',
      todorantStage: 'reflect',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '5',
      userId: 'user1',
      title: 'Call mom',
      status: 'inbox',
      priority: 'high',
      todorantStage: 'engage',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState('inbox')
  const [tasks, setTasks] = useState<Task[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    // Initialize with mock data for development
    setTasks(mockTasks)
  }, [])

  const getFilteredTasks = () => {
    let filtered = tasks

    // Filter by view
    if (activeView !== 'todorant') {
      filtered = filtered.filter(task => {
        if (activeView === 'inbox') return task.status === 'inbox'
        if (activeView === 'today') return task.status === 'today'
        if (activeView === 'upcoming') return task.status === 'upcoming'
        if (activeView === 'someday') return task.status === 'someday'
        return true
      })
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return filtered
  }

  const getTaskCounts = () => {
    return {
      inbox: tasks.filter(t => t.status === 'inbox').length,
      today: tasks.filter(t => t.status === 'today').length,
      upcoming: tasks.filter(t => t.status === 'upcoming').length,
      someday: tasks.filter(t => t.status === 'someday').length,
    }
  }

  const handleToggleComplete = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            status: task.status === 'completed' ? 'inbox' : 'completed',
            completedAt: task.status === 'completed' ? undefined : new Date().toISOString()
          }
        : task
    ))
    toast.success('Task updated!')
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setIsEditModalOpen(true)
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId))
    toast.success('Task deleted!')
  }

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return

    const newTask: Task = {
      id: Date.now().toString(),
      userId: user?.id || 'user1',
      title: newTaskTitle,
      status: 'inbox',
      priority: 'none',
      todorantStage: 'capture',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setTasks(prev => [newTask, ...prev])
    setNewTaskTitle('')
    toast.success('Task added!')
  }

  const handleMoveTaskToStage = (taskId: string, stage: Task['todorantStage']) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId
        ? { ...task, todorantStage: stage, updatedAt: new Date().toISOString() }
        : task
    ))
    toast.success(`Task moved to ${stage} stage!`)
  }

  const handleSaveTask = (updatedTask: Task) => {
    if (editingTask) {
      // Update existing task
      setTasks(prev => prev.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      ))
      toast.success('Task updated!')
    } else {
      // Add new task
      setTasks(prev => [updatedTask, ...prev])
      toast.success('Task created!')
    }
  }

  const handleCreateNewTask = () => {
    setEditingTask(null)
    setIsEditModalOpen(true)
  }

  const getViewTitle = () => {
    switch (activeView) {
      case 'inbox': return 'Inbox'
      case 'today': return 'Today'
      case 'upcoming': return 'Upcoming'
      case 'someday': return 'Someday'
      case 'todorant': return 'Todorant Workflow'
      default: return 'Tasks'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Things</h1>
          <p className="text-gray-600 mb-8">Please sign in to continue</p>
          <Button onClick={() => blink.auth.login()}>
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <Sidebar
          activeView={activeView}
          onViewChange={setActiveView}
          taskCounts={getTaskCounts()}
          onQuickAdd={handleCreateNewTask}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{getViewTitle()}</h1>
                {activeView !== 'todorant' && (
                  <p className="text-gray-600 mt-1">
                    {getFilteredTasks().length} tasks
                  </p>
                )}
              </div>
              
              <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>

                {/* Quick Add */}
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Add a task..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                    className="w-64"
                  />
                  <Button onClick={handleAddTask} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button onClick={handleCreateNewTask} variant="outline" size="sm">
                    New Task
                  </Button>
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 p-6">
            {activeView === 'todorant' ? (
              <TodorantWorkflow
                tasks={tasks}
                onMoveTaskToStage={handleMoveTaskToStage}
              />
            ) : (
              <TaskList
                tasks={getFilteredTasks()}
                onToggleComplete={handleToggleComplete}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                emptyMessage={`No tasks in ${activeView}`}
              />
            )}
          </main>
        </div>
      </div>
      
      <TaskEditModal
        task={editingTask}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveTask}
      />
      
      <Toaster />
    </>
  )
}

export default App