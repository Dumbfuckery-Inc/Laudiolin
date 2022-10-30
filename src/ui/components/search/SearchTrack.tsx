import React from "react";
import { Figure } from "react-bootstrap";
import Button from "@components/Button";

import { faPause, faPlay, faAdd, faShare, faCopy } from "@fortawesome/free-solid-svg-icons";
import { player, playFromResult } from "@backend/audio";

import type { SearchResult } from "@backend/types";

import "@css/SearchTrack.scss";

interface IProps {
    result: SearchResult;
}
interface IState {
    playing: boolean;
    hasPlayed: boolean;
}

/* A track that appears when searching for it. */
class SearchTrack extends React.Component<IProps, IState> {
    updateState = () => {
        if (!this.state.hasPlayed) return;
        this.setState({
            playing: !this.state.playing,
            hasPlayed: !this.state.hasPlayed
        });
    };

    constructor(props: IProps) {
        super(props);

        this.state = {
            playing: false,
            hasPlayed: false
        };
    }

    componentDidMount() {
        // Listen for player events.
        player.on("stop", this.updateState);
        player.on("resume", this.updateState);
        player.on("pause", this.updateState);
    }

    componentWillUnmount() {
        // Un-listen for player events.
        player.removeListener("stop", this.updateState);
        player.removeListener("resume", this.updateState);
        player.removeListener("pause", this.updateState);
    }

    playTrack = () => {
        const hasPlayed = this.state.hasPlayed;
        const isPlaying = this.state.playing;

        if (hasPlayed) {
            player.togglePlayback(); // Pause/resume the player.
            this.setState({ playing: !isPlaying });
        } else {
            // Check if the player is currently playing.
            if (player.isPlaying()) player.stopTrack();
            this.setState({ hasPlayed: true });

            // Play the track from the specified result.
            playFromResult(this.props.result).then(() => {
                // Change the state to playing.
                this.setState({ playing: !isPlaying });
            });
        }
    };

    preview1 = () => {
        alert("This should bring the user to a laudiolin-based song preview.");
    };

    preview2 = () => {
        alert("Will bind functions to it when its implemented.");
    };

    openTrackSource = () => {
        window.open(this.props.result.url, "_blank");
    };

    copyTrackURL = async () => {
        await navigator.clipboard.writeText(this.props.result.url);
    };

    toggleDropdown = () => {
        document.getElementById("trackDropdown").classList.toggle("show");
    };

    render() {
        const result = this.props.result;

        return (
            <div className="SearchResult list-group-item dark:text-white dark:bg-slate-800" key={result.id}>
                <Figure id="figure">
                    <Figure.Caption id="statusButton">
                        <Button
                            id="statusButtonImage"
                            icon={this.state.hasPlayed ? (this.state.playing ? faPause : faPlay) : faPlay}
                            onClick={this.playTrack}
                        />
                    </Figure.Caption>

                    <a onClick={this.preview1}>
                        <Figure.Image src={result.icon} id="image" />
                    </a>

                    <Figure.Caption className="TrackInfo result-title">
                        <a onClick={this.preview1}>
                            <span>{result.title}</span>
                        </a>

                        <p className="text-gray-600">{result.artist}</p>

                        <Figure.Caption className="TrackOptions">
                            <Button icon={faAdd} className="TrackOptionsButtons" tooltip="Add to playlist" onClick={this.preview2} />
                            <Button icon={faShare} className="TrackOptionsButtons" tooltip="Open track source" onClick={this.openTrackSource} />
                            <Button icon={faCopy} className="TrackOptionsButtons" tooltip="Copy track URL" onClick={this.copyTrackURL} />
                        </Figure.Caption>

                    </Figure.Caption>

                </Figure>
            </div>
        );
    }
}

export default SearchTrack;
