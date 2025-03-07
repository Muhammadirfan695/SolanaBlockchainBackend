import React, { useState } from 'react';
import { Plus, Trash2, Settings, AlertTriangle, Zap, DollarSign, ArrowRight, ChevronDown, ChevronUp, Activity, MessageSquare, TrendingUp } from 'lucide-react';
import CopyAddress from './CopyAddress';

interface Task {
  id: string;
  type: 'volume' | 'micro-buy' | 'bump' | 'comment';
  token: string;
  settings: {
    amount: number;
    wallets: number;
    interval: number;
    duration: number;
    maxPrice?: number;
    minAmount?: number;
    maxAmount?: number;
    comment?: string;
  };
  status: 'active' | 'paused' | 'completed';
}

export default function TokenBundle() {
  const [activeTab, setActiveTab] = useState<'tasks' | 'new'>('tasks');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<Task>({
    id: '',
    type: 'volume',
    token: '',
    settings: {
      amount: 0.1,
      wallets: 5,
      interval: 60,
      duration: 24,
    },
    status: 'paused'
  });

  const handleCreateTask = () => {
    if (newTask.token) {
      setTasks(prev => [...prev, { ...newTask, id: Date.now().toString() }]);
      setActiveTab('tasks');
    }
  };

  const renderTaskCard = (task: Task) => (
    <div key={task.id} className="bg-white/5 rounded-lg p-6 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {task.type === 'volume' && <Activity className="h-5 w-5 text-green-400" />}
          {task.type === 'micro-buy' && <DollarSign className="h-5 w-5 text-blue-400" />}
          {task.type === 'bump' && <TrendingUp className="h-5 w-5 text-purple-400" />}
          {task.type === 'comment' && <MessageSquare className="h-5 w-5 text-yellow-400" />}
          <div>
            <h3 className="text-lg font-medium text-white capitalize">{task.type}</h3>
            <CopyAddress address={task.token} className="text-gray-400" />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            className={`px-4 py-2 rounded-lg ${
              task.status === 'active'
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
            }`}
          >
            {task.status === 'active' ? 'Stop' : 'Start'}
          </button>
          <button className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg">
            Edit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <div className="bg-white/5 rounded-lg p-3">
          <p className="text-sm text-gray-400">Amount</p>
          <p className="text-lg font-medium text-white">{task.settings.amount} SOL</p>
        </div>
        <div className="bg-white/5 rounded-lg p-3">
          <p className="text-sm text-gray-400">Wallets</p>
          <p className="text-lg font-medium text-white">{task.settings.wallets}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-3">
          <p className="text-sm text-gray-400">Interval</p>
          <p className="text-lg font-medium text-white">{task.settings.interval}s</p>
        </div>
        <div className="bg-white/5 rounded-lg p-3">
          <p className="text-sm text-gray-400">Duration</p>
          <p className="text-lg font-medium text-white">{task.settings.duration}h</p>
        </div>
      </div>
    </div>
  );

  const renderNewTaskForm = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm text-gray-400 mb-2">Task Type</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['volume', 'micro-buy', 'bump', 'comment'].map((type) => (
            <button
              key={type}
              onClick={() => setNewTask(prev => ({ ...prev, type: type as Task['type'] }))}
              className={`px-4 py-3 rounded-lg border ${
                newTask.type === type
                  ? 'border-purple-500 text-purple-400 bg-white/5'
                  : 'border-white/10 text-gray-400 bg-white/5'
              }`}
            >
              <div className="flex items-center justify-center">
                {type === 'volume' && <Activity className="h-5 w-5 mr-2" />}
                {type === 'micro-buy' && <DollarSign className="h-5 w-5 mr-2" />}
                {type === 'bump' && <TrendingUp className="h-5 w-5 mr-2" />}
                {type === 'comment' && <MessageSquare className="h-5 w-5 mr-2" />}
                <span className="capitalize">{type}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-2">Token Address</label>
        <input
          type="text"
          value={newTask.token}
          onChange={(e) => setNewTask(prev => ({ ...prev, token: e.target.value }))}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
          placeholder="Enter token address"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Amount per Transaction (SOL)</label>
          <input
            type="number"
            value={newTask.settings.amount}
            onChange={(e) => setNewTask(prev => ({
              ...prev,
              settings: { ...prev.settings, amount: Number(e.target.value) }
            }))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
            min="0.001"
            step="0.001"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Number of Wallets</label>
          <input
            type="number"
            value={newTask.settings.wallets}
            onChange={(e) => setNewTask(prev => ({
              ...prev,
              settings: { ...prev.settings, wallets: Number(e.target.value) }
            }))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
            min="1"
            max="100"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Interval (seconds)</label>
          <input
            type="number"
            value={newTask.settings.interval}
            onChange={(e) => setNewTask(prev => ({
              ...prev,
              settings: { ...prev.settings, interval: Number(e.target.value) }
            }))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
            min="30"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Duration (hours)</label>
          <input
            type="number"
            value={newTask.settings.duration}
            onChange={(e) => setNewTask(prev => ({
              ...prev,
              settings: { ...prev.settings, duration: Number(e.target.value) }
            }))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
            min="1"
          />
        </div>
      </div>

      {newTask.type === 'comment' && (
        <div>
          <label className="block text-sm text-gray-400 mb-2">Comment Template</label>
          <textarea
            value={newTask.settings.comment}
            onChange={(e) => setNewTask(prev => ({
              ...prev,
              settings: { ...prev.settings, comment: e.target.value }
            }))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
            rows={4}
            placeholder="Enter your comment template..."
          />
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <button
          onClick={() => setActiveTab('tasks')}
          className="px-6 py-3 rounded-lg text-gray-400 hover:text-white"
        >
          Cancel
        </button>
        <button
          onClick={handleCreateTask}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg"
        >
          Create Task
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Token Tasks</h2>
            <p className="text-gray-400">Manage your token's volume and visibility</p>
          </div>
          {activeTab === 'tasks' && (
            <button
              onClick={() => setActiveTab('new')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Task
            </button>
          )}
        </div>

        {activeTab === 'tasks' ? (
          <div className="space-y-6">
            {tasks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">No tasks created yet</p>
                <button
                  onClick={() => setActiveTab('new')}
                  className="text-purple-400 hover:text-purple-300 mt-2"
                >
                  Create your first task
                </button>
              </div>
            ) : (
              tasks.map(task => renderTaskCard(task))
            )}
          </div>
        ) : (
          renderNewTaskForm()
        )}
      </div>
    </div>
  );
}