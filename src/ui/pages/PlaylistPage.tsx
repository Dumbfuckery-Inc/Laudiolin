import React from "react";
import { useParams } from 'react-router-dom';

import { Playlist } from "@backend/types";
import { fetchPlaylist } from "@backend/audio";

import AnimatePages from "@components/common/AnimatePages";
import PlaylistTracks from "@components/playlist/PlaylistTracks";

import { faUpload } from "@fortawesome/free-solid-svg-icons";
import Button from "@components/common/Button";

import "@css/Playlist.scss";

interface IState {
    playlist: Playlist;
    banner: string;
}

export function withRouter(Children: React.ComponentClass) {
    return(props) => {
        const match  = { params: useParams() };
        return <Children {...props}  match={match}/>
    }
}

class PlaylistPage extends React.Component<any, IState> {
    constructor(props) {
        super(props);

        this.state = {
            playlist: null,
            banner: ""
        }
    }

    displayUploadButton = () => {
        const button = document.getElementById("BannerUpload");
        button.style.display = "block";
    }

    hideUploadButton = () => {
        const button = document.getElementById("BannerUpload");
        button.style.display = "none";
    }

    setBanner = async () => {
        const url = document.getElementById("BannerURL") as HTMLInputElement;
        await localStorage.setItem(`playlist-${this.state.playlist.id}-banner`, url.value);
        this.setState({ banner: url.value });
        this.hideModal();
    }

    displayModal = () => {
        const modal = document.getElementById("PlaylistModal");
        modal.style.display = "block";
    }

    hideModal = () => {
        const modal = document.getElementById("PlaylistModal");
        modal.style.display = "none";
    }

    componentDidMount() {
        fetchPlaylist(this.props.match.params.id).then((playlist) => {
            this.setState({
                playlist: playlist,
                banner: localStorage.getItem(`playlist-${playlist.id}-banner` || null)
            });
        });

        window.onclick = (event) => {
            if (event.target == document.getElementById("PlaylistModal")) {
                this.hideModal();
            }
        }
    }

    render() {
        if (this.state.playlist == null) {
            return <h2 id="NoPlaylistMessage">No playlists found.</h2>
        }
        return (
            <AnimatePages>
                <div className="PlaylistContainer">
                    <div className="PlaylistHeader" onMouseOver={this.displayUploadButton} onMouseLeave={this.hideUploadButton}>
                        <div className="PlaylistHeaderBG" style={{ backgroundImage: `url(${this.state.banner || this.state.playlist.icon})` }}></div>
                        <img src={this.state.playlist.icon} className="PlaylistIcon" alt={this.state.playlist.name}/>
                        <div className="PlaylistHeaderInfo">
                            <h2>{this.state.playlist.name}</h2>
                            <p>{this.state.playlist.description}</p>
                        </div>
                        <Button id="BannerUpload" icon={faUpload} onClick={this.displayModal} />
                        <div id="PlaylistModal" className="Modal">
                            <div className="ModalContent">
                                <span className="CloseModal" onClick={this.hideModal}>&times;</span>
                                <h2>Upload a banner</h2>
                                <input type="text" id="BannerURL" placeholder="Image URL" />
                                <Button className="ModalSubmit" onClick={this.setBanner}>Submit</Button>
                            </div>
                        </div>
                    </div>
                    <div className="PlaylistContent">
                        <PlaylistTracks tracks={this.state.playlist.tracks} />
                    </div>
                </div>
            </AnimatePages>
        );
    }
}

export default withRouter(PlaylistPage)
