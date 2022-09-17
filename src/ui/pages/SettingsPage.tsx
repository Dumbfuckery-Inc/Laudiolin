import React from "react";
import Settings from "@components/settings/Settings";
import AnimatePages from "@components/AnimatePages";

class SettingsPage extends React.Component {
    render() {
        return (
            <AnimatePages>
                <Settings />
            </AnimatePages>
        )
    }
}

export default SettingsPage;