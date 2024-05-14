import React, { useEffect, useState } from 'react';
import Cookie from 'cookie';
import style from './App.module.css';
import SideBarMenu from './Components/SideBarMenu/SideBarMenu';
import PromocodeList from './Components/PromocodeList/PromocodeList';

const App = () => {
    const [activeItemId, setActiveItemId] = useState(1);

    const [gameData, setGameData] = useState([]);

    const [promocodeData, setPromocodeData] = useState({
        result: [],
    });

    useEffect(() => {
        Promise.all([
            fetch('https://api.hoyopromo.ru/api/v1/game/'),
            fetch('https://api.hoyopromo.ru/api/v1/promocode/'),
        ])
            .then(([resultGame, resultPromocode]) =>
                Promise.all([resultGame.json(), resultPromocode.json()])
            )
            .then(([dataGame, dataPromocode]) => {
                setGameData(dataGame);
                setPromocodeData(dataPromocode);
            })
            .catch((error) => console.log(error.message));
        // eslint-disable-next-line
    }, []);

    const filterPromocodesByGame = (filterValue, arrayData) => {
        return arrayData.filter((item) => item.game.id === filterValue);
    };

    const deleteCookie = () => {
        const cookie = Cookie.parse(document.cookie);

        const keys = Object.keys(cookie);

        for (let i = 0; i < keys.length; i++) {
            document.cookie = `${keys[i]}="";expires=Thu, 01 Jan 1970 00:00:00 GMT;max-age=-1`;
            console.log('-');
        }
    };

    return (
        <div className={style.appContainer}>
            <button
                type="button"
                onClick={() => {
                    console.log(document.cookie);
                    console.log('-------------');
                    deleteCookie();
                    console.log(document.cookie);
                }}>
                click
            </button>
            <div className={style.menu}>
                <SideBarMenu
                    data={gameData}
                    activeItemId={activeItemId}
                    setActiveItemId={setActiveItemId}
                />
            </div>
            <div className={style.content}>
                <PromocodeList
                    data={filterPromocodesByGame(
                        activeItemId,
                        promocodeData.result
                    )}
                    activeItemId={activeItemId}
                />
            </div>
        </div>
    );
};

export default App;
