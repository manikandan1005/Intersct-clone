"use client";
import React, { useEffect, useState } from "react";
import { Box, Flex, Button, Table } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import useAxios from "@/lib/http/useAxios";
import { FaArrowsToEye } from "react-icons/fa6";
import { FaUserEdit } from "react-icons/fa";

export default function RoleMappingPage() {
    const router = useRouter();
    const dummyRoles: any = [
        { name: "Admin", status: true },
        { name: "Editor", status: true },
        { name: "Viewer", status: false },
        { name: "Agent", status: true },
        { name: "Custom Role", status: false },
    ];

    const name = "Role Mapping";
    const permission = JSON.parse(typeof window !== "undefined" ? localStorage.getItem("permission") as string : "null");
    const access = { create: true, edit: true, delete: true, view: true };
    // const access =
    //     permission === "FULL_ACCESS"
    //         ? { create: true, edit: true, delete: true, view: true }
    //         : permission.find((i: any) => i.screenName === name);

    const titles = ["SNO", "Role", "Status", "Action"];
    const [data, setData] = useState([]);
    const [request,res] = useAxios<any>({ endpoint: "GETROLE" });

    const getRoles = async () => {
        try {
            const res = await request();
            setData(res && res.length > 0 ? res : dummyRoles);
        } catch (err) {
            console.log(err);
            setData(dummyRoles);
        }
    };
    function editData(data: any) {
        console.log(data)
    }
    function viewData(data: any) {
        console.log(data)
    }

    useEffect(() => {
      // request()
      //  setData(res);
        getRoles();
    }, []);

    return (
        <Box p="4">
            <Flex direction="column">
                <Box>
                    <Flex justifyContent="space-between">
                        <h1>Role list</h1>
                        <Button onClick={() => (router.push("/inbox/role-mapping/create-role"))}>
                            Create
                        </Button>
                    </Flex>
                </Box>
                <Box m="7">
                    <Table.ScrollArea borderWidth="1px" rounded="md" maxH="560px">
                        <Table.Root size="sm" stickyHeader variant="outline">
                            <Table.Header bg="gray.100">
                                <Table.Row>
                                    {titles.map((title, idx) => (
                                        <Table.ColumnHeader key={idx}>{title}</Table.ColumnHeader>
                                    ))}
                                </Table.Row>
                            </Table.Header>

                            <Table.Body >
                                {data.map((items: any, index) => (
                                    <Table.Row key={index}>
                                        <Table.Cell >{index + 1}</Table.Cell>
                                        <Table.Cell>{items.name}</Table.Cell>
                                        <Table.Cell>{String(items.status) === 'true' ? "Active" : "Inactive"}</Table.Cell>
                                        <Table.Cell >
                                            <Flex gap="10px">
                                                {access.view &&
                                                    <Button
                                                        onClick={()=>viewData(items)}
                                                        className="bg-yellow-500! hover:text-yellow-500! border-4 hover:bg-white! hover:border-yellow-500! text-white! cursor-pointer m-2!">
                                                        view
                                                    </Button>}
                                                {items.name !== "Admin" && access?.edit &&
                                                    <Button
                                                        onClick={()=>editData(items)}
                                                        className="bg-blue-700! text-whit! hover:text-blue-700! border-4 hover:bg-white! hover:border-blue-700! cursor-pointer m-2!" >
                                                        Edit
                                                    </Button>}
                                            </Flex>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Root>
                    </Table.ScrollArea>
                </Box>
            </Flex>
        </Box>
    );
}