import React from 'react';
import style from './style.module.scss';

interface UserChatProps {
    msg: String;
}

export const UserChat = ({ msg }: UserChatProps) => {
    return (
        <div className={style.wrapperUserChat}>
            <div className={style.userChat}>
                <p>{msg}</p>
            </div>
        </div>
    );
};