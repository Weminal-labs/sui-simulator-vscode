import React from 'react';
import style from './style.module.scss';

interface BotChatProps {
    msg: String;
}

export const BotChat = ({ msg }: BotChatProps) => {
    return (
        <div className={style.wrapperBotChat}>
            <div className={style.botChat}>
                <p>{msg}</p>
            </div>
        </div>
    );
};