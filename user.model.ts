type User = {
    id: string;
    username: string;
    password: string;
    currentToken: string | null;
  };
  
  export const users: User[] = [
    { id: '1', username: 'admin', password: 'admin123', currentToken: null }
  ];
  
  export const findUser = (username: string) => users.find(u => u.username === username);
  
  export const updateUserToken = (userId: string, token: string | null) => {
    const user = users.find(u => u.id === userId);
    if (user) user.currentToken = token;
  };
  