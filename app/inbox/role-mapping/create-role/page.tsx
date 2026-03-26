"use client"
import useAxios from '@/lib/http/useAxios';
import { Flex, Checkbox, Table, Button, Input } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { MdOutlineAddReaction, MdCancel } from "react-icons/md";
import React, { useEffect, useState } from 'react'
import { useLogin } from '@/lib/loginStore';


function page() {
  const actions: string[] = ["SNO", "screenStatus", "view", "edit", "create", "delete",]
  const router = useRouter()
  const [request] = useAxios({ endpoint: "CREATEROLE" })
  // const screenMasterData = useLogin((s) => s.screenmaster);
  // const screenMasterData = data.screens;

  const getScreeMaster = useLogin((s) => s.getScreeMaster);
  const screenmaster = useLogin((s) => s.screenmaster);

  const [role, setRole] = useState<{ name: string; screens: any[] }>({
    name: "",
    screens: []
  });

  useEffect(() => {
    if (screenmaster.length > 0) {
      setRole((prev) => ({
        ...prev,
        screens: screenmaster.map((screen) => ({
          id: screen.id,
          name: screen.name,
          permissions: {
            create: false,
            edit: false,
            delete: false,
            view: false,
          },
          status: "true"
        }))
      }));
    }
  }, [screenmaster]);

  function handleChanges(index: number, field: string, value: boolean) {
    setRole((prevRole) => {
      const newScreens = [...prevRole.screens];
      if (newScreens[index]) {
        newScreens[index] = {
          ...newScreens[index],
          permissions: {
            ...newScreens[index].permissions,
            [field]: value
          }
        };
      }
      return { ...prevRole, screens: newScreens };
    });
  }

  const onSubmit = async () => {
    const payload = {
      name: role.name,
      permissions: role.screens
    };
    console.log("Sent successfully", payload)
    try {
      const response = await request({
        method: "POST",
        data: payload
      });
      console.log("Backend response:", response);
      router.back();
    } catch (err) {
      alert(err)
      console.error("Error sending data", err)
    }
  }

  function sendData() {
    onSubmit()
  }


  useEffect(() => {
    const fetchData = async () => {
      await getScreeMaster();
    };
    fetchData();
  }, []);
  return (
    <div>
      <Flex direction="column" gap="25px" m="15px">
        <Flex justifyContent="space-between">
          <Flex w='300px' direction="column" gap="10px">
            <label>Create Role<span className="text-red-600">*</span></label>
            <Input
              type="text"
              value={role.name}
              onChange={(event) =>
                setRole((prevRole) => ({
                  ...prevRole,
                  name: event.target.value
                }))
              }
            />
          </Flex>
          <Button
            colorScheme="blue"
            onClick={() => router.back()}
          >
            Back
          </Button>
        </Flex>
        <Table.Root>

          <Table.Header>
            <Table.Row>
              {actions.map((tital, index) => (
                <Table.Cell>{tital}</Table.Cell>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {screenmaster.map((screen, index) => (
              <Table.Row key={index}>
                <Table.Cell>{index + 1}</Table.Cell>
                <Table.Cell >{screen.name}</Table.Cell>
                <Table.Cell>
                  {screen.permissions.view ?
                    <Checkbox.Root
                      variant="solid"
                      colorPalette="green"
                      checked={role.screens[index]?.permissions.view === true}
                      onCheckedChange={(details) => {
                        handleChanges(index, "view", details.checked === true)
                      }}
                    >
                      <Checkbox.HiddenInput />
                      <Checkbox.Control />
                    </Checkbox.Root>
                    : "-"
                  }
                </Table.Cell>
                <Table.Cell>
                  {screen.permissions.edit ?
                    <Checkbox.Root
                      variant="solid"
                      colorPalette="green"
                      checked={role.screens[index]?.permissions.edit === true}
                      onCheckedChange={(details) => {
                        handleChanges(index, "edit", details.checked === true)
                      }}
                    >
                      <Checkbox.HiddenInput />
                      <Checkbox.Control />
                    </Checkbox.Root>
                    : "-"
                  }
                </Table.Cell>
                <Table.Cell>
                  {screen.permissions.create ?
                    <Checkbox.Root
                      variant="solid"
                      colorPalette="green"
                      checked={role.screens[index]?.permissions.create === true}
                      onCheckedChange={(details) => {
                        handleChanges(index, "create", details.checked === true)
                      }}
                    >
                      <Checkbox.HiddenInput />
                      <Checkbox.Control />
                    </Checkbox.Root>
                    : "-"
                  }
                </Table.Cell>
                <Table.Cell>
                  {screen.permissions.delete ?
                    <Checkbox.Root
                      variant="solid"
                      colorPalette="green"
                      checked={role.screens[index]?.permissions.delete === true}
                      onCheckedChange={(details) => {
                        handleChanges(index, "delete", details.checked === true)
                      }}
                    >
                      <Checkbox.HiddenInput />
                      <Checkbox.Control />
                    </Checkbox.Root>
                    : "-"
                  }</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>

        </Table.Root>
        <Flex gap="10px" justify="Center" alignItems="center">
          <Button variant="subtle" colorPalette="green" className=' text-white' onClick={() => { sendData() }}><MdOutlineAddReaction />
            Create</Button>
          <Button variant="subtle" colorPalette="red" className=' text-white' onClick={() => {
            setRole({ name: "", screens: [] });
            // router.back()
          }}><MdCancel />
            Cancel</Button>
        </Flex>
      </Flex>
    </div>
  )
}

export default page