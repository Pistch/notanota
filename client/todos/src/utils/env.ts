declare global {
    interface Navigator {
        userAgentData: {
            platform: string;
        } | null;
    }
}

export function isMac() {
    const navigatorUaPlatform = navigator.userAgentData?.platform;

    if (!navigatorUaPlatform) {
        return /mac/i.test(navigator.platform);
    } else {
        return navigatorUaPlatform.toLowerCase() === 'macos';
    }
}
