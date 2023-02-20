import React from "react";

import { ImStack } from "react-icons/im";
import { IoMdPause, IoMdPlay } from "react-icons/io";
import { MdShuffle, MdRepeat, MdRepeatOne } from "react-icons/md";
import { IoMdSkipBackward, IoMdSkipForward } from "react-icons/io";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FiExternalLink } from "react-icons/fi";
import { FiVolumeX, FiVolume1, FiVolume2 } from "react-icons/fi";

import BasicButton from "@components/common/BasicButton";

import type { TrackData } from "@backend/types";
import TrackPlayer from "@mod/player";

import "@css/layout/ControlPanel.scss";

interface IState {
    queue: boolean;
    playing: boolean;
    track: TrackData | null;
}

class ControlPanel extends React.Component<any, IState> {
    /**
     * Player update callback.
     */
    update = () => this.setState({
        track: TrackPlayer.getCurrentTrack()?.data,
        queue: TrackPlayer.getQueue().length > 0,
        playing: !TrackPlayer.paused,
    });

    constructor(props: any) {
        super(props);

        this.state = {
            queue: false,
            playing: false,
            track: null
        };
    }

    componentDidMount() {
        TrackPlayer.on("update", this.update);
    }

    componentWillUnmount() {
        TrackPlayer.off("update", this.update);
    }

    /**
     * Toggles the repeat mode.
     */
    toggleRepeatMode(): void {
        switch (TrackPlayer.getRepeatMode()) {
            case "none": TrackPlayer.setRepeatMode("track"); break;
            case "track": TrackPlayer.setRepeatMode("queue"); break;
            case "queue": TrackPlayer.setRepeatMode("none"); break;
        }
    }

    /**
     * Gets the icon for the appropriate repeat mode.
     */
    getRepeatIcon(): React.ReactNode {
        switch (TrackPlayer.getRepeatMode()) {
            case "none": return <MdRepeat />;
            case "track": return <MdRepeat className={"ControlPanel_Repeat"} />;
            case "queue": return <MdRepeatOne className={"ControlPanel_Repeat"} />;
        }
    }

    render() {
        const { queue, playing, track } = this.state;
        const isFavorite = true;

        console.log(playing);

        return (
            <div className={"ControlPanel"}>
                <div className={"ControlPanel_Track"}>
                    {
                        track && <>
                            <img
                                className={"ControlPanel_Icon"}
                                alt={track.title ?? "No track"}
                                src={track.icon ?? "https://i.imgur.com/0Q9QZ9A.png"}
                            />

                            <div className={"ControlPanel_TrackInfo"}>
                                <p>{track.title}</p>
                                <p>{track.artist}</p>
                            </div>
                        </>
                    }
                </div>

                <div className={"ControlPanel_MainControls"}>
                    <div className={"ControlPanel_Controls"}>
                        <BasicButton
                            default={false}
                            icon={isFavorite ?
                                <AiFillHeart style={{ color: "var(--accent-color)" }} /> :
                                <AiOutlineHeart />}
                            className={"ControlPanel_Control"}
                            onClick={() => console.log("Favorite")}
                        />

                        <BasicButton
                            default={false}
                            icon={<MdShuffle />}
                            className={"ControlPanel_Control"}
                            onClick={() => TrackPlayer.shuffle()}
                        />

                        <BasicButton
                            default={false}
                            icon={<IoMdSkipBackward />}
                            className={"ControlPanel_Control"}
                            onClick={() => TrackPlayer.back()}
                        />

                        <BasicButton
                            default={false}
                            icon={playing ? <IoMdPause /> : <IoMdPlay />}
                            className={"ControlPanel_Control"}
                            onClick={() => TrackPlayer.pause()}
                        />

                        <BasicButton
                            default={false}
                            icon={<IoMdSkipForward />}
                            className={"ControlPanel_Control"}
                            onClick={() => TrackPlayer.next()}
                        />

                        <BasicButton
                            default={false}
                            icon={this.getRepeatIcon()}
                            className={"ControlPanel_Control"}
                            onClick={() => this.toggleRepeatMode()}
                        />

                        <BasicButton
                            default={false}
                            icon={queue ? <ImStack /> : null}
                            className={"ControlPanel_Control"}
                            onClick={() => console.log("See Queue")}
                        />
                    </div>

                    <input type={"range"} className={"ControlPanel_ProgressBar"} />
                </div>

                <div className={"ControlPanel_Right"}>
                    <FiVolume2 />
                    <input type={"range"} className={"ControlPanel_Volume"} />
                    <FiExternalLink />
                </div>
            </div>
        );
    }
}

export default ControlPanel;