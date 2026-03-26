import useAxios from "@/lib/http/useAxios";
import { Flex } from "@chakra-ui/react";

import React, { useEffect, useState } from "react";


export interface User {
  id: string;
  email: string;
  password: string;
  role: string;
  name: string;
  phone_number: string;
}

export interface Data {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  countryCode?: string;
  phoneNumber: string;
  last_login: string | null;
  adminId: string;
  userId: string;
  chatId: string | null;
  SubContact: string;
  user: User;
}
interface Props {
  access: {
    create: boolean;
    edit: boolean;
    delete: boolean;
    view: boolean;
  };
}
function AgentList({ access }: Props) {

  const[call,setCall]=useState<boolean>(true)
  const [list, setList] = useState<Data[]>([]);
  const [request, res] = useAxios<Data[]>({ endpoint: "AGENTLIST" })
  const [deleteAgent, data] = useAxios<Data[]>({ endpoint: "DELETEAGENT" ,successCb() {
      setCall(!call)
  },})

  const title = [
    "S No",
    "Agent Name",
    "Phone No",
    "Email",
    "Created By",
    "Last Login",
    "Action",
  ];
  //        const getData = async () => {
  //     try {
  //       const res = await request({ method: "GET" })
  //       setList(res || [])
  //       console.log(res)
  // const agentNames = (res || []).map((item) => item.firstName);
  // if (typeof window !== "undefined") {
  //   localStorage.setItem("agentName", JSON.stringify(agentNames));
  // }
  //       //const agentName= 
  //     }
  //     catch (error) {
  //       console.error(error)
  //     }
  //   }
  // getData()

  useEffect(() => {
   async function getData  ()  {
      const result = await request()  // await the async call
      setList(result || [])           // now result has the data ✅
    }
    getData()
  }, [call])
  function Delete(id: string) {
    // alert("delete will start ")
    const isConfirmed=window.confirm("Are you sure delete the Agent");
    if(isConfirmed){
      deleteAgent({ path: `/${id}` })
    }
  }

  return (

    <div className="flex flex-col gap-10  items-center justify-center w-full mx-2 my-2 sticky">
      <div className="flex w-full p-2 items-start">
        <div >
          <input type="search" placeholder="Search..." name="" id="" className="p-3! shadow  bg-gray-50 rounded " />
        </div>
      </div>
      {!list ? (<Flex direction="column" alignItems="center" justifyContent="center">
        <h1>No contacts Found. Please add a contact.</h1>
      </Flex>) : (<div className="w-full hidden lg:block">
        <table className="border-2!  rounded!  border-collapse! w-full">
          <thead>
            <tr>
              {title.map((item) => (
                <th key={item} className="!border !px-4 !py-3 !font-bold text-left">
                  {item}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {list.map((agent, index) => (
              <tr key={agent.id}>
                <td className="!border !px-4 !py-3">{index + 1}</td>
                <td className="!border !px-4 !py-3">{agent.firstName}</td>
                <td className="!border !px-4 !py-3">{agent.phoneNumber}</td>
                <td className="!border !px-4 !py-3">{agent.email}</td>
                <td className="!border !px-4 !py-3">{agent.role}</td>
                {/* <td className="!border !px-4 !py-3">{agent.team}</td> */}
                <td className="!border !px-4 !py-3">{agent.last_login ? new Date(agent.last_login).toLocaleDateString() : "-"}</td>
                <td className="!border !px-4 !py-3 flex items-center justify-center gap-3">
                  {!access.edit && !access.delete ? "-" : (
                    <>
                      {access.edit && <button
                        // onClick={()=>Edit(agent.id)}
                        className="!px-3 !py-1 !border-2 !border-blue-500 !bg-blue-500 !text-white hover:!bg-white hover:!text-blue-500 !rounded">Edit</button>}
                      {access.delete && <button
                        onClick={() => Delete(agent.id)}
                        className="!bg-red-600 !py-1 !px-3 !border-2 !border-red-600 !rounded hover:!bg-white hover:!text-red-600 !text-white">Delete</button>}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>)}
    </div>
  );
}

export default AgentList;