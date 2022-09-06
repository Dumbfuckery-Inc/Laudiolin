import React from "react";
import "../App.css";
import Button from "react-bootstrap/Button";
import { Track } from "backend/music";
import Form from "react-bootstrap/Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faVolumeMute, faVolumeUp, faVolumeDown } from "@fortawesome/free-solid-svg-icons";
import ProgressBar from "react-bootstrap/ProgressBar";

interface IProps {}
interface IState {
    playing: boolean;
    muted: boolean;
    volume: number;
}

const toggleTrack = (track: Track, state: IState, setState: any) => {
    track.sound.playing() ? track.sound.pause() : track.sound.play();
    setState({ playing: !state.playing });
};

function changeVolume(track: Track, value: number, setState: any) {
    track.sound.volume(value / 100);
    setState({ volume: value });
}

const toggleMute = (track: Track, state: IState, setState: any) => {
    state.muted ? track.sound.mute(false) : track.sound.mute(true);
    setState({ muted: !state.muted });
};

const setProgress = (track: Track, value: number, setState: any) => {
    track.sound.seek(value);
};

class Controls extends React.Component<IProps, IState> {
    track: Track;

    constructor(props: IProps) {
        super(props);
        this.track = new Track("https://app.magix.lol/download?id=c6rCRy6SrtU&source=YouTube");
        this.state = { playing: false, muted: false, volume: 100 };
    }

    render() {
        return (
            <div
                style={{
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    backgroundColor: "#212529",
                    padding: "10px",
                }}
            >
                <span
                    style={{
                        display: "table",
                        margin: "0 auto",
                    }}
                >
                    <Button
                        variant="outline-primary"
                        size="lg"
                        onClick={() => toggleTrack(this.track, this.state, this.setState.bind(this))}
                    >
                        <FontAwesomeIcon icon={this.state.playing ? faPause : faPlay} />
                    </Button>
                    <span>
                        <Button
                            variant="outline-primary"
                            size="lg"
                            onClick={() => toggleMute(this.track, this.state, this.setState.bind(this))}
                            style={{ margin: "10px", marginTop: "10px" }}
                        >
                            <FontAwesomeIcon
                                icon={
                                    this.state.muted || this.state.volume == 0
                                        ? faVolumeMute
                                        : this.state.volume < 50
                                            ? faVolumeDown
                                            : faVolumeUp
                                }
                            />
                        </Button>
                        <Form.Control
                            type="range"
                            min="0"
                            max="100"
                            defaultValue={this.state.volume}
                            onChange={(e) =>
                                changeVolume(this.track, parseInt(e.target.value), this.setState.bind(this))
                            }
                            style={{
                                maxWidth: "150px",
                                display: "inline-block",
                                verticalAlign: "middle",
                            }}
                        />
                    </span>
                </span>
                <div style={{ paddingBottom: "5px", paddingTop: "5px" }}>
                    {/* TODO: Set Duration on Click
                        TODO: doesn't update unless the UI updates on any user input :(
                    */}
                    <ProgressBar
                        now={this.track.sound.seek()}
                        style={{ height: "7px" }}
                        max={this.track.sound.duration() * 100}
                    />
                </div>
            </div>
        );
    }
}

export default Controls;
