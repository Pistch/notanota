import React from 'react';

import { AppLayout } from '../components/AppLayout';
import { SettingsProvider } from '../providers/SettingsProvider';
import { TodosContainer } from './TodosContainer';
import { SettingsContainer } from './SettingsContainer';

export function App() {
    return (
        <SettingsProvider>
            <AppLayout>
                <SettingsContainer/>
                <TodosContainer/>
            </AppLayout>
        </SettingsProvider>
    );
}
