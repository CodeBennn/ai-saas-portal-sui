import BasicDataField from "../fields/basicDataField";
import BasicInputField from "../fields/basicInputField";
import ActionButton from "../buttons/actionButton";
import { Link as LinkIcon } from "lucide-react";
import { useContext, useMemo, useState, useEffect } from "react";
import {
  useAccounts,
  useSignAndExecuteTransaction,
  useSuiClient,
  useSuiClientQuery,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { AppContext } from "@/context/AppContext";
import { toast } from "react-toastify";

const BasicContainer = () => {
  const { walletAddress, suiName } = useContext(AppContext);
  const { data: suiBalance } = useSuiClientQuery("getBalance", {
    owner: walletAddress ?? "",
  });
  const [selectedToken, setSelectedToken] = useState<string>("SUI");
  const [input, setInput] = useState<string>("");
  const client = useSuiClient();
  const [account] = useAccounts();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const [unsolvedTasks, setUnsolvedTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskForm, setTaskForm] = useState({
    prompt: '',
    task_type: 'llm',
    fee: '',
    fee_unit: 'SUI'
  });
  const [agents, setAgents] = useState([]);
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [agentForm, setAgentForm] = useState({
    addr: '',
    owner_addr: '',
    type: 'llm',
    chat_url: '',
    source_url: ''
  });

  const userBalance = useMemo(() => {
    if (suiBalance?.totalBalance) {
      return Math.floor(Number(suiBalance?.totalBalance) / 10 ** 9);
    } else {
      return 0;
    }
  }, [suiBalance]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('https://ai-saas.deno.dev/task_unsolved');
        const data = await response.json();
        setUnsolvedTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        toast.error('Failed to fetch tasks');
      }
    };

    const fetchAgents = async () => {
      try {
        const response = await fetch('https://ai-saas.deno.dev/agents');
        const data = await response.json();
        setAgents(data);
      } catch (error) {
        console.error('Error fetching agents:', error);
        toast.error('Failed to fetch agents');
      }
    };

    fetchTasks();
    fetchAgents();
  }, []);

  const handleSubmitTask = async () => {
    
    try {
      const response = await fetch('https://ai-saas.deno.dev/add_task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: walletAddress,
          ...taskForm
        }),
      });
      console.log(JSON.stringify({
          user: walletAddress,
          ...taskForm
        }));
      if (!response.ok) throw new Error('Failed to submit task' + response);
      
      toast.success('Task submitted successfully!');
      setIsModalOpen(false);
      const tasksResponse = await fetch('https://ai-saas.deno.dev/task_unsolved');
      const data = await tasksResponse.json();
      setUnsolvedTasks(data);
    } catch (error) {
      console.error('Error submitting task:', error);
      toast.error('Failed to submit task' + JSON.stringify({
        user: walletAddress,
        ...taskForm
      }));
    }
  };

  const handleSubmitAgent = async () => {
    try {
      const response = await fetch('https://ai-saas.deno.dev/add_agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(agentForm),
      });

      if (!response.ok) throw new Error('Failed to submit agent');
      
      toast.success('Agent submitted successfully!');
      setIsAgentModalOpen(false);
      const agentsResponse = await fetch('https://ai-saas.deno.dev/agents');
      const data = await agentsResponse.json();
      setAgents(data);
    } catch (error) {
      console.error('Error submitting agent:', error);
      toast.error('Failed to submit agent');
    }
  };

  async function handleTx() {
    console.log(input);
    const tx = new Transaction();

    // PTB part

    // Dry run
    tx.setSender(account.address);
    const dryRunRes = await client.dryRunTransactionBlock({
      transactionBlock: await tx.build({ client }),
    });
    if (dryRunRes.effects.status.status === "failure") {
      toast.error(dryRunRes.effects.status.error);
      return;
    }

    // Execute
    signAndExecuteTransaction(
      {
        transaction: tx,
      },
      {
        onSuccess: async (txRes) => {
          const finalRes = await client.waitForTransaction({
            digest: txRes.digest,
            options: {
              showEffects: true,
            },
          });
          toast.success("Tx Success!");
          console.log(finalRes);
        },
        onError: (err) => {
          toast.error(err.message);
          console.log(err);
        },
      },
    );
  }

  return (
    <div className="w-[80%] h-[calc(100vh-150px)] overflow-y-auto flex flex-col items-center gap-4 p-4">

      {/* Navbar */}
      <div className="flex items-center gap-4">
        <Link href="/" className="text-sm hover:text-gray-300 transition-colors">Home</Link>
        <Link href="/tasks" className="text-sm hover:text-gray-300 transition-colors">Tasks</Link>
      </div>
      {/* Header section for agent and task status */}
      <div className="w-full flex-shrink-0">
        <center><h3 className="text-3xl font-semibold mb-4">Data Panel</h3></center>
        <div className="w-full grid grid-cols-3 gap-4 mb-4">
          <BasicDataField
            label="Agent Alive"
            value="3" // Replace with actual agent status
            spaceWithUnit={false}
          />
          <BasicDataField
            label="Total Tasks"
            value={(unsolvedTasks.length + 6).toString()} // Calculate total tasks as unsolved tasks + 6
            spaceWithUnit={false}
          />
          <BasicDataField
            label="Unsolved Tasks"
            value={unsolvedTasks.length.toString()} // Display actual count of unsolved tasks
            spaceWithUnit={false}
          />
        </div>
      </div>
      <h3 className="text-3xl font-semibold mb-4">Unsolved Tasks Stack</h3>
      
      <div className="w-full">
        <table className="w-full table-auto border-collapse">
          <thead className="sticky top-0 bg-white">
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-blue-600">ID</th>
              <th className="border px-4 py-2 text-blue-600">User</th>
              <th className="border px-4 py-2 text-blue-600">Task Type</th>
              <th className="border px-4 py-2 text-blue-600">Prompt</th>
              <th className="border px-4 py-2 text-blue-600">Fee</th>
              <th className="border px-4 py-2 text-blue-600">Created At</th>
              <th className="border px-4 py-2 text-blue-600">Unique ID</th>
            </tr>
          </thead>
          <tbody>
            {unsolvedTasks.map((task: any) => (
              <tr key={task.id}>
                <td className="border px-4 py-2">{task.id}</td>
                <td className="border px-4 py-2">
                  {task.user.slice(0, 6)}...{task.user.slice(-4)}
                  <button
                    onClick={() => navigator.clipboard.writeText(task.user)}
                    className="ml-2 text-blue-500 hover:underline"
                  >
                    Copy
                  </button>
                </td>
                <td className="border px-4 py-2">{task.task_type}</td>
                <td className="border px-4 py-2">{task.prompt}</td>
                <td className="border px-4 py-2">{task.fee} {task.fee_unit}</td>
                <td className="border px-4 py-2">
                  {new Date(task.created_at).toLocaleDateString()}
                </td>
                <td className="border px-4 py-2">
                  {task.unique_id}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="w-full flex justify-center">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        >
          Submit New Task
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[500px]">
            <h3 className="text-2xl font-semibold mb-4">Submit New Task</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Task Type</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-blue-500"
                  value={taskForm.task_type}
                  onChange={(e) => setTaskForm({...taskForm, task_type: e.target.value})}
                >
                  <option value="llm">LLM</option>
                  <option value="img">IMG</option>
                  <option value="trade">TRADE</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Task Description</label>
                <textarea
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-blue-500"
                  rows={4}
                  value={taskForm.prompt}
                  onChange={(e) => setTaskForm({...taskForm, prompt: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Fee (Optional)</label>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-blue-500"
                  value={taskForm.fee}
                  onChange={(e) => setTaskForm({...taskForm, fee: e.target.value})}
                /> 
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-blue-500"
                  value={taskForm.fee_unit}
                  onChange={(e) => setTaskForm({...taskForm, fee_unit: e.target.value})}
                >
                  <option value="SUI">SUI</option>
                  <option value="USDC">USDC</option>
                </select>
              </div>
              
            </div>
            

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitTask}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      <h3 className="text-3xl font-semibold mb-4">AI Agents</h3>
      <div className="w-full">
        <table className="w-full table-auto border-collapse">
          <thead className="sticky top-0 bg-white">
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-blue-600">ID</th>
              <th className="border px-4 py-2 text-blue-600">Description</th>
              <th className="border px-4 py-2 text-blue-600">Type</th>
              <th className="border px-4 py-2 text-blue-600">Address</th>
              <th className="border px-4 py-2 text-blue-600">Owner</th>
              <th className="border px-4 py-2 text-blue-600">Source</th>
              <th className="border px-4 py-2 text-blue-600">Solved Times</th>
              <th className="border px-4 py-2 text-blue-600">Created At</th>
              <th className="border px-4 py-2 text-blue-600">Unique ID</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent: any) => (
              <tr key={agent.id}>
                <td className="border px-4 py-2">{agent.id}</td>
                <td className="border px-4 py-2">{agent.description}</td>
                <td className="border px-4 py-2">{agent.type.toUpperCase()}</td>
                <td className="border px-4 py-2">
                  {agent.addr.slice(0, 6)}...{agent.addr.slice(-4)}
                  <button
                    onClick={() => navigator.clipboard.writeText(agent.addr)}
                    className="ml-2 text-blue-500 hover:underline"
                  >
                    Copy
                  </button>
                </td>
                <td className="border px-4 py-2">
                  {agent.owner_addr.slice(0, 6)}...{agent.owner_addr.slice(-4)}
                  <button
                    onClick={() => navigator.clipboard.writeText(agent.owner_addr)}
                    className="ml-2 text-blue-500 hover:underline"
                  >
                    Copy
                  </button>
                </td>
                <td className="border px-4 py-2">
                  <a 
                    href={agent.source_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View Source
                  </a>
                </td>
                <td className="border px-4 py-2">{agent.solved_times}</td>
                <td className="border px-4 py-2">
                  {new Date(agent.created_at).toLocaleDateString()}
                </td>
                <td className="border px-4 py-2">{agent.unique_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="w-full flex justify-center">
        <button
          onClick={() => setIsAgentModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        >
          Submit New Agent
        </button>
      </div>

      {/* Add new Agent Modal */}
      {isAgentModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[500px]">
            <h3 className="text-2xl font-semibold mb-4">Submit New Agent</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Agent Address</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-blue-500"
                  value={agentForm.addr}
                  onChange={(e) => setAgentForm({...agentForm, addr: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Owner Address</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-blue-500"
                  value={agentForm.owner_addr}
                  onChange={(e) => setAgentForm({...agentForm, owner_addr: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Agent Type</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-blue-500"
                  value={agentForm.type}
                  onChange={(e) => setAgentForm({...agentForm, type: e.target.value})}
                >
                  <option value="llm">LLM</option>
                  <option value="img">IMG</option>
                  <option value="trade">TRADE</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Chat URL (Optional)</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-blue-500"
                  value={agentForm.chat_url}
                  onChange={(e) => setAgentForm({...agentForm, chat_url: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Source URL (Optional)</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-blue-500"
                  value={agentForm.source_url}
                  onChange={(e) => setAgentForm({...agentForm, source_url: e.target.value})}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsAgentModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitAgent}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BasicContainer;
