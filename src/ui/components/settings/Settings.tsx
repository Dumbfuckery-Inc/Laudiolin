import React from "react";
import Button from "@components/Button";
import { faFolder } from "@fortawesome/free-solid-svg-icons";

import * as config from "@backend/settings";
import type { SearchEngine, UserSettings } from "@backend/types";

import { open } from "@tauri-apps/api/dialog";
import { appDir } from "@tauri-apps/api/path";

import "@css/Settings.scss";

interface IState {
    accuracy: boolean;
    engine: SearchEngine;
    download_path: string;
    encrypted: boolean;
    address: string;
    port: number;
    gateway_port: number;
    background_color: string;
    background_url: string;
}

class Settings extends React.Component<any, IState> {
    constructor(props: any) {
        super(props);

        this.state = {
            accuracy: false,
            engine: "YouTube",
            download_path: "downloads",
            encrypted: true,
            address: "app.magix.lol",
            port: 443,
            gateway_port: 443,
            background_color: "",
            background_url: ""
        };
    }

    setAccuracy = (accuracy: boolean) => {
        this.setState({
            accuracy: accuracy
        });
    };

    setEngine = (engine: SearchEngine) => {
        this.setState({
            engine: engine
        });
    };

    setDownloadPath = (download_path: string) => {
        this.setState({
            download_path: download_path
        });
    };

    setEncryption = (encrypted: boolean) => {
        this.setState({
            encrypted: encrypted
        });
    };

    setAddress = (address: string) => {
        this.setState({
            address: address
        });
    };

    setPort = (port: number) => {
        this.setState({
            port: port
        });
    };

    setGatewayPort = (gateway_port: number) => {
        this.setState({
            gateway_port: gateway_port
        });
    };

    setBackgroundColor = (background_color: string) => {
        this.setState({
            background_color: background_color
        });
    };

    setBackgroundUrl = (background_url: string) => {
        this.setState({
            background_url: background_url
        });
    };

    toggleDropdown = () => {
        document.getElementById("engineDropdown").classList.toggle("show");
    };

    selectDirectory = async () => {
        const result = await open({
            defaultPath: await appDir(),
            multiple: false,
            directory: true
        });

        if (result) {
            this.setDownloadPath(result as string);
        }
    };

    async componentDidMount() {
        await config.reloadSettings()
        await this.setState({
            accuracy: config.search().accuracy,
            engine: config.search().engine,
            download_path: config.audio().download_path,
            encrypted: config.gateway().encrypted,
            address: config.gateway().address,
            port: config.gateway().port,
            gateway_port: config.gateway().gateway_port,
            background_color: config.ui().background_color,
            background_url: config.ui().background_url
        });
    }

    async componentWillUnmount() {
        await config.saveSettings({
            search: {
                accuracy: this.state.accuracy,
                engine: this.state.engine
            },
            audio: {
                download_path: this.state.download_path
            },
            gateway: {
                encrypted: this.state.encrypted,
                address: this.state.address,
                port: this.state.port,
                gateway_port: this.state.gateway_port
            },
            ui: {
                background_color: this.state.background_color,
                background_url: this.state.background_url
            }
        } as UserSettings);

        // TODO: Restart the websocket connection.
    }

    render() {
        return (
            <table className="SettingsOptions">
                <tbody>
                    <tr className="SettingsHeadings">
                        <th>Search Settings</th>
                    </tr>
                    <tr>
                        <th scope="row">Accuracy:</th>
                        <td>
                            <input
                                type="checkbox"
                                id="check"
                                checked={this.state.accuracy}
                                onChange={(e) => this.setAccuracy(e.currentTarget.checked)}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Engine:</th>
                        <td>
                            <button onClick={this.toggleDropdown} className="dropbtn">
                                Search Engine
                            </button>
                            <div id="engineDropdown" className="dropdown-content">
                                <p
                                    onClick={() => {
                                        this.setEngine("YouTube" as SearchEngine);
                                        this.toggleDropdown();
                                    }}
                                >
                                    YouTube
                                </p>
                                <p
                                    onClick={() => {
                                        this.setEngine("Spotify" as SearchEngine);
                                        this.toggleDropdown();
                                    }}
                                >
                                    Spotify
                                </p>
                                <p
                                    onClick={() => {
                                        this.setEngine("SoundCloud" as SearchEngine);
                                        this.toggleDropdown();
                                    }}
                                >
                                    SoundCloud
                                </p>
                                <p
                                    onClick={() => {
                                        this.setEngine("All" as SearchEngine);
                                        this.toggleDropdown();
                                    }}
                                >
                                    All
                                </p>
                            </div>
                        </td>
                    </tr>
                </tbody>
                <tbody>
                    <tr className="SettingsHeadings">
                        <th>Audio Settings</th>
                    </tr>
                    <tr>
                        <th scope="row">Downloads Folder:</th>
                        <td>
                            <input className="dirInputText" type="text" value={this.state.download_path} readOnly />
                            <Button
                                className="dirSelector"
                                icon={faFolder}
                                onClick={() => this.selectDirectory()}
                            />
                        </td>
                    </tr>
                </tbody>
                <tbody>
                    <tr className="SettingsHeadings">
                        <th>Gateway Settings</th>
                    </tr>
                    <tr>
                        <th scope="row">Toggle Encryption:</th>
                        <td>
                            <input
                                type="checkbox"
                                id="check"
                                checked={this.state.encrypted}
                                onChange={(e) =>
                                    e.currentTarget.checked ? this.setEncryption(true) : this.setEncryption(false)
                                }
                            />
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Address:</th>
                        <td>
                            <input
                                className="normalInputText"
                                type="text"
                                value={this.state.address}
                                onInput={(e) => this.setAddress(e.currentTarget.value)}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Port:</th>
                        <td>
                            <input
                                className="normalInputText"
                                type="number"
                                value={this.state.port}
                                onInput={(e) => this.setPort(e.currentTarget.valueAsNumber)}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Gateway Port:</th>
                        <td>
                            <input
                                className="normalInputText"
                                type="number"
                                value={this.state.gateway_port}
                                onInput={(e) => this.setGatewayPort(e.currentTarget.valueAsNumber)}
                            />
                        </td>
                    </tr>
                </tbody>
                <tbody>
                    <tr className="SettingsHeadings">
                        <th>UI Settings</th>
                    </tr>
                    <tr>
                        <th scope="row">Background Color:</th>
                        <td>
                            <input
                                className="normalInputText"
                                type="text"
                                placeholder="#000000"
                                value={this.state.background_color}
                                onInput={(e) => this.setBackgroundColor(e.currentTarget.value)}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Background URL:</th>
                        <td>
                            <input
                                className="normalInputText"
                                type="text"
                                placeholder="https://example.com/image.png"
                                value={this.state.background_url}
                                onInput={(e) => this.setBackgroundUrl(e.currentTarget.value)}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}

export default Settings;
