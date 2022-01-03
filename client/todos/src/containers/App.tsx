import React from 'react';

import { AppLayout } from '../components/AppLayout';
import { TodosContainer } from './TodosContainer';

export function App() {
  return (
      <AppLayout>
        <TodosContainer />
      </AppLayout>
  );
}
