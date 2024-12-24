import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
    uri: '/api/graphql',
    cache: new InMemoryCache({
        addTypename: false
    }),
    defaultOptions: {
        query: {
            fetchPolicy: 'network-only'
        },
        mutate: {
            fetchPolicy: 'no-cache'
        }
    }
});

export default client;
