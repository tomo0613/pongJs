import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Core as Game} from './core';
import './style/master.css';

class Canvas extends React.Component<{}, any> {
    canvasRef: any = null;
    game: any;
    state = {
        name1: 'player',
        score1: 0,
        name2: 'computer',
        score2: 0,
        playerServe: true,
    };

    componentDidMount() {
        this.game = new Game(this.canvasRef);

        this.game.reset();
        this.game.drawScene();

        this.game.setListeners({
            onScore: (player: 'player1'|'player2') => {
                this.game.stop();
                this.game.reset();

                this.setState((state) => {
                    const key = 'score' + player.replace(/\D/g, '');

                    return {
                        [key]: state[key] + 1,
                    };
                });
            }
        });
    }

    render() {
        return [
            this.createHud(),
            <canvas width={640} height={480} ref={(ref) => this.canvasRef = ref} onClick={this.startGame} key="game" />
        ];
    }

    createHud() {
        const {name1, score1, name2, score2} = this.state;

        return (
            <div id="hud" key="hud">
                <div>{name1 + ': ' + score1}</div>
                <div>{name2 + ': ' + score2}</div>
            </div>
        );
    }

    startGame = (e) => {
        if (this.game.stopped) {
            this.game.start(500);
        }
    }
}

ReactDOM.render(
    <Canvas />,
    document.getElementById('rootElement')
);
