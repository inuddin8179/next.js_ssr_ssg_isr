import Navbar from '@/components/Navbar';
import React from 'react';
import { QueryClient, Hydrate,dehydrate } from '@tanstack/react-query';
import useDataFetch from '@/hooks/UseDataFetch';
import { GetServerSideProps } from 'next';

interface User {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
}

interface Props {
    initialTodos: User[];
    dehydratedState:User[]
    error: string | null;
}

const dataFetch = async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    return response.json();
};

const Index: React.FC<Props> = ({ initialTodos,dehydratedState}) => {
    
  const {data:user,isLoading,isError}=useDataFetch<User[]>('https://jsonplaceholder.typicode.com/users','user',initialTodos)


    return (
        <Hydrate state={dehydratedState}>
             <div>
            <Navbar />
            <h1>Server Side Rendering with TanStack Query</h1>
            {isLoading && <div>Loading...</div>}
            {isError && <div>Error...</div>}
            <ul>
                {user?.slice(0,10).map((user: User) => (
                    <li key={user.id}>{user.title}</li>
                ))}
            </ul>
        </div>
        </Hydrate>
       
    );
};

export const getServerSideProps: GetServerSideProps = async () => {
    const queryClient = new QueryClient();

     await queryClient.prefetchQuery({
        queryKey: ['user'],
        queryFn: dataFetch,
      })
      const initialTodos = queryClient.getQueryData<User[]>(['user']) || [];

    return {
        props: {
            initialTodos,
            dehydratedState: dehydrate(queryClient),
        },
    };
};

export default Index