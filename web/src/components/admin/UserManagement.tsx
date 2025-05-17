import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose 
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { User } from '@/types';

const formSchema = z.object({
  username: z.string().min(3, { message: "Username deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
  isAdmin: z.boolean().default(false)
});

export function UserManagement() {
  const { users, addUser, removeUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      isAdmin: false
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await addUser(values.username, values.email, values.password, values.isAdmin);
      form.reset();
      setIsOpen(false);
    } catch (error) {
      console.error('Error in form submission:', error);
    }
  }

  function handleRemoveUser(userId: string) {
    if (confirm("Tem certeza que deseja remover este usuário?")) {
      removeUser(userId);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Gerenciamento de Usuários</h2>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button>Adicionar Usuário</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Adicionar Novo Usuário</SheetTitle>
              <SheetDescription>
                Crie uma nova conta de usuário para o sistema de apostas
              </SheetDescription>
            </SheetHeader>
            <div className="py-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome de usuário</FormLabel>
                        <FormControl>
                          <Input placeholder="usuario123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="usuario@exemplo.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="******" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isAdmin"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4"
                          />
                        </FormControl>
                        <FormLabel className="mt-0">É administrador</FormLabel>
                        <FormDescription>
                          Administradores podem gerenciar outros usuários
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  <SheetFooter>
                    <SheetClose asChild>
                      <Button variant="outline">Cancelar</Button>
                    </SheetClose>
                    <Button type="submit">Salvar</Button>
                  </SheetFooter>
                </form>
              </Form>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Usuário</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user: User) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.id}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.isAdmin ? "Administrador" : "Usuário"}</TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleRemoveUser(user.id)}
                  disabled={user.id === '1'} // Desabilita para o admin principal
                >
                  Remover
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
