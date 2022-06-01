import { useContext, useMemo, createContext } from 'react';

import type { ISettings, TSettingsSetter } from '../types';

export const DEFAULT_SETTINGS = {
    shouldShowPrivate: false,
};

export const SettingsContext = createContext<{ settings: ISettings, setSettings: TSettingsSetter }>({
    settings: DEFAULT_SETTINGS,
    setSettings: () => {
        // noop
    },
});

export function useSettings<
    TFields extends ReadonlyArray<keyof ISettings>,
    TReturnedSettings extends Pick<ISettings, TFields[number]>,
>(...fields: TFields): [TReturnedSettings, TSettingsSetter] {
    const { settings, setSettings } = useContext(SettingsContext);
    const settingsObject = useMemo(() => {
        return fields.reduce((map, fieldName) => {
            // @ts-expect-error dunno what does it want
            map[fieldName] = settings[fieldName];

            return map;
        }, {} as TReturnedSettings);
    }, [settings, ...fields]);

    return [settingsObject, setSettings];
}
