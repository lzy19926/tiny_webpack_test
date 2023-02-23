import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Drawer from '@mui/material/Drawer';
import { TransitionGroup } from 'react-transition-group';

import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import GitHubIcon from '@mui/icons-material/GitHub';
import QuizIcon from '@mui/icons-material/Quiz';

import store from '../store/index'
import DarkModeSwitch from './DarkModeSwitch.jsx'
import FontChooser from './FontChooser.jsx'
import { timestampToTime } from '../utils/index'

let loading = false
let currentMsg = ''


const Licence = () => (<p className='licence'>designed by lzy19926  mail: 871921282@qq.com version:0.2</p>)

//! messageList
function MessageList() {
    const [messages, setMessages] = useState([]);
    const [open, setOpen] = useState(false);
    const { Size } = store.useState('Size')
    useEffect(() => { listenEnter() }, [])

    const handleClickOpen = () => {
        if (messages.length === 0) return
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const sendMessage = async () => {
        if (!currentMsg) return
        if (loading) return

        const newMsg = {
            id: Date.now(),
            user: 'YOU',
            msg: currentMsg,
            time: timestampToTime(Date.now()),
            color: 'green'
        }

        setMessages(prev => [...prev, newMsg])


        loading = true
        const res = await fetch(`http://localhost:8080/API/message?msg=${currentMsg}`, { method: 'GET' })
        currentMsg = ''
        const { data } = await res.json()
        const newGPTMsg = {
            id: Date.now(),
            user: 'GPT',
            msg: data,
            time: timestampToTime(Date.now()),
            color: 'gray'
        }
        setMessages(prev => [...prev, newGPTMsg])
        loading = false
    }
    const clearMessages = () => {
        setMessages([])
        handleClose()
    }
    const handleRemoveMsg = (msg) => {
        setMessages((prev) => [...prev.filter((i) => i.id !== msg.id)]);
    };
    const renderItem = ({ msg }) => {
        const DeleteButton = (
            <Tooltip title="删除">
                <IconButton
                    edge="end"
                    aria-label="delete"
                    title="Delete"
                    onClick={() => handleRemoveMsg(msg)}
                >
                    <DeleteIcon sx={Size.icon} />
                </IconButton>
            </Tooltip>

        )
        const textFiled = (
            <pre style={{ ...Size.text, whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
                {`${msg.msg}`}
            </pre>
        )

        const tagFiled = (
            <p style={{ ...Size.tag, textAlign: "end", color: "rgb(115 115 115)" }}>
                {`${msg.time}`}
            </p>
        )

        const paperCSS = {
            display: 'flex',
            alignItems: 'center',
            maxWidth: 1000,
            margin: 1.5,
            borderRadius: 4
        }

        return (
            <Paper elevation={10} sx={paperCSS}>
                <ListItem secondaryAction={DeleteButton}>
                    <ListItemAvatar>
                        <Avatar sx={{ ...Size.avatar, backgroundColor: msg.color }}>
                            {msg.user}
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        sx={{ m: 0 }}
                        disableTypography={true}
                        primary={textFiled}
                        secondary={tagFiled}
                    />
                </ListItem>
            </Paper>
        );
    }
    const CustomizedInput = () => {

        const paperCSS = {
            p: '12px 6px',
            display: 'flex',
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            alignItems: 'center',
            zIndex: 999
        }
        const successBtnProps = {
            variant: "contained",
            color: "success",
            size: "large",
            sx: { p: '10px' },
            disabled: loading
        }
        const clearBtnProps = {
            variant: "contained",
            color: "error",
            size: "large",
            sx: { p: '10px' },
            disabled: messages.length === 0
        }
        return (
            <Paper elevation={4} component="form" sx={paperCSS}  >
                <TextField
                    id="outlined-basic"
                    label="问点什么..."
                    variant="outlined"
                    sx={{ ml: 1, flex: 3 }}
                    onChange={(e) => { currentMsg = e.target.value }}
                />

                <IconButton color="primary" aria-label="directions" onClick={sendMessage}>
                    <Button {...successBtnProps}>发送消息</Button>
                </IconButton>
                <IconButton color="primary" aria-label="directions" onClick={handleClickOpen}>
                    <Button  {...clearBtnProps}>清空消息</Button>
                </IconButton>
            </Paper>
        )
    }
    const AlertDialog = () => {
        return (
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
            >
                <DialogTitle id="alert-dialog-title">
                    {"确定要清空所有对话记录吗?"}
                </DialogTitle>
                <DialogActions>
                    <Button onClick={clearMessages}>删除</Button>
                    <Button onClick={handleClose}>取消</Button>
                </DialogActions>
            </Dialog>
        )
    }
    const listenEnter = () => {
        window.addEventListener('keydown', (e) => {
            if (e.keyCode === 13) {
                sendMessage()
                e.preventDefault()
            }
        })
    }

    return (
        <div>
            <AlertDialog />
            <Box sx={{ mt: 8, mb: 11 }}>
                <List sx={{ width: '100%', maxWidth: 1000, bgcolor: 'background.paper' }}>
                    <TransitionGroup>
                        {messages.map((msg) => (
                            <Slide key={msg.id} direction="right">
                                {renderItem({ msg })}
                            </Slide>
                        ))}
                    </TransitionGroup>
                </List>
            </Box>
            <CustomizedInput />
        </div>
    );
}

//! option模态框
function OptionDrawer({ open, onClose }) {


    const OptionItem = ({ title, inner }) => (
        <>
            <ListItem sx={{ color: 'rgb(111, 126, 140)', fontWeight: 700, textIndent: "1em" }}>
                {title}
            </ListItem>
            <ListItem sx={{ justifyContent: "space-around" }}>
                {inner}
            </ListItem>
        </>
    )
    return (
        <Drawer anchor="right" open={open} onClose={onClose} sx={{ borderRadius: 4 }}>
            <header className='drawerHeader'>设置</header>
            <List>
                <OptionItem title="模式" inner={<DarkModeSwitch />} />
                <OptionItem title="字体" inner={<FontChooser />} />
            </List>
        </Drawer>
    )
}

//! help模态框
function HelpDrawer({ open, onClose }) {
    return (
        <Drawer anchor="right" open={open} onClose={onClose} sx={{ borderRadius: 4 }}>
            <header className='drawerHeader'>帮助</header>
        </Drawer>
    )
}

//! 头部导航栏
function TopGuider() {

    const [showOption, setShowOption] = useState(false)
    const closeOption = () => { setShowOption(false) }
    const openOption = () => { setShowOption(true) }

    const [showHelp, setShowHelp] = useState(false)
    const closeHelp = () => { setShowHelp(false) }
    const openHelp = () => { setShowHelp(true) }

    const buttonCSS = {
        width: 36,
        height: 36,
        p: 2,
        ml: 2,
        minWidth: 36,
        borderColor: "#ccc",
        borderRadius: 2
    }

    return (
        <div className='fixedTop'>
            <header className='header'>
                <h2>chatGPT桌面版_UI测试版</h2>
                <div className='buttonGroup'>
                    <Tooltip title="Github">
                        <Button variant="outlined" sx={buttonCSS}>
                            <GitHubIcon />
                        </Button>
                    </Tooltip>
                    <Tooltip title="帮助">
                        <Button variant="outlined" sx={buttonCSS} onClick={openHelp}>
                            <QuizIcon />
                        </Button>
                    </Tooltip>
                    <Tooltip title="设置">
                        <Button variant="outlined" sx={buttonCSS} onClick={openOption}>
                            <SettingsOutlinedIcon />
                        </Button>
                    </Tooltip>
                </div>
                <OptionDrawer open={showOption} onClose={closeOption} />
                <HelpDrawer open={showHelp} onClose={closeHelp} />


            </header>
        </div>

    )
}

//! ChatGPT聊天组件
export default function ChatGPT() {

    return (
        <React.Fragment>

            <TopGuider />
            <MessageList />
            <OptionDrawer />
            <Licence />
        </React.Fragment>
    )

}