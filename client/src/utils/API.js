import { ApolloClient, InMemoryCache, gql } from '@apollo/client';


const client = new ApolloClient({
  uri: 'http://localhost:3001/graphql', 
  cache: new InMemoryCache()
});

 export const GET_ME = gql`
    query GetMe {
      me {
        _id
        username
        email
        bookCount
        savedBooks {
          bookId
          authors
          description
          title
          image
          link
        }
      }
    }
  `;

  
export const createUser = async (userData) => {
  const CREATE_USER = gql`
    mutation CreateUser($username: String!, $email: String!, $password: String!) {
      createUser(username: $username, email: $email, password: $password) {
        token
        user {
          _id
          username
          email
          bookCount
          savedBooks {
            bookId
            authors
            description
            title
            image
            link
          }
        }
      }
    }
  `;

  const { data } = await client.mutate({ mutation: CREATE_USER, variables: userData });
  return data;
};

export const loginUser = async (userData) => {
  const LOGIN_USER = gql`
    mutation LoginUser($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        token
        user {
          _id
          username
          email
          bookCount
          savedBooks {
            bookId
            authors
            description
            title
            image
            link
          }
        }
      }
    }
  `;

  const { data } = await client.mutate({ mutation: LOGIN_USER, variables: userData });
  return data;
};

export const saveBook = async (bookData, token) => {
  const SAVE_BOOK = gql`
    mutation SaveBook($authors: [String], $description: String, $title: String, $bookId: String, $image: String, $link: String) {
      saveBook(authors: $authors, description: $description, title: $title, bookId: $bookId, image: $image, link: $link) {
        _id
        username
        email
        bookCount
        savedBooks {
          bookId
          authors
          description
          title
          image
          link
        }
      }
    }
  `;

  const { data } = await client.mutate({ mutation: SAVE_BOOK, variables: bookData, context: { headers: { authorization: `Bearer ${token}` } } });
  return data;
};

export const deleteBook = async (bookId, token) => {
  const DELETE_BOOK = gql`
    mutation DeleteBook($bookId: String) {
      deleteBook(bookId: $bookId) {
        _id
        username
        email
        bookCount
        savedBooks {
          bookId
          authors
          description
          title
          image
          link
        }
      }
    }
  `;

  const { data } = await client.mutate({ mutation: DELETE_BOOK, variables: { bookId }, context: { headers: { authorization: `Bearer ${token}` } } });
  return data;
};

// make a search to google books api
// https://www.googleapis.com/books/v1/volumes?q=harry+potter
export const searchGoogleBooks = (query) => {
  return fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
};
