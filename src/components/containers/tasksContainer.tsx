import BasicDataField from "../fields/basicDataField";
import BasicInputField from "../fields/basicInputField";
import ActionButton from "../buttons/actionButton";
import { useContext, useMemo, useState, useEffect } from "react";
import {
  useAccounts,
  useSignAndExecuteTransaction,
  useSuiClient,
  useSuiClientQuery,
} from "@mysten/dapp-kit";
import LinksContainer from "./linkContainer";
import { Transaction } from "@mysten/sui/transactions";
import { AppContext } from "@/context/AppContext";
import { toast } from "react-toastify";
import { CompletedCard } from "../uiWrapper/Card";

const TasksContainer = () => {
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
    prompt: "",
    task_type: "llm",
    fee: "",
    fee_unit: "SUI",
  });
  const [agents, setAgents] = useState([]);
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [agentForm, setAgentForm] = useState({
    addr: "",
    owner_addr: "",
    type: "llm",
    chat_url: "",
    source_url: "",
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
        const response = await fetch("https://ai-saas.deno.dev/tasks");
        const data = await response.json();
        setUnsolvedTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast.error("Failed to fetch tasks");
      }
    };

    const fetchAgents = async () => {
      try {
        const response = await fetch("https://ai-saas.deno.dev/agents");
        const data = await response.json();
        setAgents(data);
      } catch (error) {
        console.error("Error fetching agents:", error);
        toast.error("Failed to fetch agents");
      }
    };

    fetchTasks();
    fetchAgents();
  }, []);

  const handleSubmitTask = async () => {
    try {
      const response = await fetch("https://ai-saas.deno.dev/add_task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: walletAddress,
          ...taskForm,
        }),
      });
      console.log(
        JSON.stringify({
          user: walletAddress,
          ...taskForm,
        })
      );
      if (!response.ok) throw new Error("Failed to submit task" + response);

      toast.success("Task submitted successfully!");
      setIsModalOpen(false);
      const tasksResponse = await fetch(
        "https://ai-saas.deno.dev/task_unsolved"
      );
      const data = await tasksResponse.json();
      setUnsolvedTasks(data);
    } catch (error) {
      console.error("Error submitting task:", error);
      toast.error(
        "Failed to submit task" +
          JSON.stringify({
            user: walletAddress,
            ...taskForm,
          })
      );
    }
  };

  const handleSubmitAgent = async () => {
    try {
      const response = await fetch("https://ai-saas.deno.dev/add_agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(agentForm),
      });

      if (!response.ok) throw new Error("Failed to submit agent");

      toast.success("Agent submitted successfully!");
      setIsAgentModalOpen(false);
      const agentsResponse = await fetch("https://ai-saas.deno.dev/agents");
      const data = await agentsResponse.json();
      setAgents(data);
    } catch (error) {
      console.error("Error submitting agent:", error);
      toast.error("Failed to submit agent");
    }
  };

  // async function handleTx() {
  //   console.log(input);
  //   const tx = new Transaction();

  //   // PTB part

  //   // Dry run
  //   tx.setSender(account.address);
  //   const dryRunRes = await client.dryRunTransactionBlock({
  //     transactionBlock: await tx.build({ client }),
  //   });
  //   if (dryRunRes.effects.status.status === "failure") {
  //     toast.error(dryRunRes.effects.status.error);
  //     return;
  //   }

  //   // Execute
  //   signAndExecuteTransaction(
  //     {
  //       transaction: tx,
  //     },
  //     {
  //       onSuccess: async (txRes) => {
  //         const finalRes = await client.waitForTransaction({
  //           digest: txRes.digest,
  //           options: {
  //             showEffects: true,
  //           },
  //         });
  //         toast.success("Tx Success!");
  //         console.log(finalRes);
  //       },
  //       onError: (err) => {
  //         toast.error(err.message);
  //         console.log(err);
  //       },
  //     }
  //   );
  // }

  return (
    <div className="w-[100%] sm:w-[100%] md:w-[90%] lg:w-[80%] mt-20 overflow-y-auto flex flex-col items-center gap-4 p-0 lg:p-4">
      <LinksContainer />
      {/* Header section for agent and task status */}
      <div className="w-full flex-shrink-0 p-4 mb-2 lg:mb-10">
        <center>
          <h3 className="text-3xl font-semibold mb-4">Data Panel</h3>
        </center>
        <div className="w-full grid grid-cols-3 gap-4 mb-4 text-nowrap">
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
      <h3 className="text-3xl font-semibold mb-4">All Tasks</h3>

      <div className="columns-1 lg:columns-2 gap-4 space-y-4">
        {unsolvedTasks.map((task: any) => (
          <div
            key={task.unique_id}
            className="break-inside-avoid w-full "
          >
            <CompletedCard
              id={task?.id}
              user={task?.user}
              task_type={task?.task_type}
              prompt={task?.prompt}
              fee={task?.fee}
              fee_unit={task?.fee_unit}
              created_at={task?.created_at}
              solution={task?.solution}
              solver_type={task?.solver_type}
              unique_id={task?.unique_id}
            />
          </div>

          // <tr key={task.id}>
          //   <td className="border border-gray-700 px-4 py-2">{task.id}</td>
          //   <td className="border border-gray-700 px-4 py-2">
          //     {task.user.slice(0, 6)}...{task.user.slice(-4)}
          //     <button
          //       onClick={() => navigator.clipboard.writeText(task.user)}
          //       className="ml-2 text-blue-500 hover:underline"
          //     >
          //       Copy
          //     </button>
          //   </td>
          //   <td className="border border-gray-700 px-4 py-2">
          //     {task.task_type}
          //   </td>
          //   <td className="border border-gray-700 px-4 py-2">
          //     {task.prompt}
          //   </td>
          //   <td className="border border-gray-700 px-4 py-2">
          //     {task.fee} {task.fee_unit}
          //   </td>
          //   <td className="border border-gray-700 px-4 py-2">
          //     {new Date(task.created_at).toLocaleDateString()}
          //   </td>
          //   <td className="border border-gray-700 px-4 py-2">
          //     {task.unique_id}
          //   </td>
          //   <td className="border border-gray-700 px-4 py-2">
          //     {task.solution?.startsWith("data:image/png") ||
          //     task.solution?.startsWith("https://p.ipic.vip") ? (
          //       <img
          //         src={task.solution}
          //         alt="Task solution"
          //         className="max-w-[200px]"
          //       />
          //     ) : (
          //       task.solution
          //     )}
          //   </td>
          //   <td className="border px-4 py-2">{task.solver_type}</td>
          // </tr>
        ))}

        {/* <table className="w-full table-auto border-collapse">
          <thead className="sticky top-0 bg-white">
            <tr className="bg-black">
              <th className="border border-gray-700 px-4 py-2 text-gray-300">
                ID
              </th>
              <th className="border border-gray-700 px-4 py-2 text-gray-300">
                User
              </th>
              <th className="border border-gray-700 px-4 py-2 text-gray-300">
                Task Type
              </th>
              <th className="border border-gray-700 px-4 py-2 text-gray-300">
                Prompt
              </th>
              <th className="border border-gray-700 px-4 py-2 text-gray-300">
                Fee
              </th>
              <th className="border border-gray-700 px-4 py-2 text-gray-300">
                Created At
              </th>
              <th className="border border-gray-700 px-4 py-2 text-gray-300">
                Unique ID
              </th>
              <th className="border border-gray-700 px-4 py-2 text-gray-300">
                Solution
              </th>
              <th className="border border-gray-700 px-4 py-2 text-gray-300">
                Solver Type
              </th>
            </tr>
          </thead>
          <tbody>
            {unsolvedTasks.map((task: any) => (
              <tr key={task.id}>
                <td className="border border-gray-700 px-4 py-2">{task.id}</td>
                <td className="border border-gray-700 px-4 py-2">
                  {task.user.slice(0, 6)}...{task.user.slice(-4)}
                  <button
                    onClick={() => navigator.clipboard.writeText(task.user)}
                    className="ml-2 text-blue-500 hover:underline"
                  >
                    Copy
                  </button>
                </td>
                <td className="border border-gray-700 px-4 py-2">
                  {task.task_type}
                </td>
                <td className="border border-gray-700 px-4 py-2">
                  {task.prompt}
                </td>
                <td className="border border-gray-700 px-4 py-2">
                  {task.fee} {task.fee_unit}
                </td>
                <td className="border border-gray-700 px-4 py-2">
                  {new Date(task.created_at).toLocaleDateString()}
                </td>
                <td className="border border-gray-700 px-4 py-2">
                  {task.unique_id}
                </td>
                <td className="border border-gray-700 px-4 py-2">
                  {task.solution?.startsWith("data:image/png") ||
                  task.solution?.startsWith("https://p.ipic.vip") ? (
                    <img
                      src={task.solution}
                      alt="Task solution"
                      className="max-w-[200px]"
                    />
                  ) : (
                    task.solution
                  )}
                </td>
                <td className="border px-4 py-2">{task.solver_type}</td>
              </tr>
            ))}
          </tbody>
        </table> */}
      </div>
    </div>
  );
};

export default TasksContainer;
