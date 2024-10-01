import React, { useState, useRef, useEffect } from 'react';
import { Col, Row, Navbar, Spinner } from 'react-bootstrap';
import NameToggles from '../NameThings/NameToggles';
import { getClaimedTotal, getUrlId, getUserClaimedTotal } from '../HelperFunctions';
import SummaryModal from '../Modals/SummaryModal';
import ShareModal from '../Modals/ShareModal';
import AddNewItemModal from '../Modals/AddNewItemModal';
import AddUserModal from '../Modals/AddUserModal';
import { FaPlus, FaUserPlus, FaShareSquare } from 'react-icons/fa';
import { useSignalR } from '../SignalRContext';
import { SignalRProvider } from '../SignalRContext';
import ReceiptItem from '../ReceiptItem/ReceiptItem';
import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArchiveIcon from '@mui/icons-material/Archive';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import GroupIcon from '@mui/icons-material/Group';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import IosShareIcon from '@mui/icons-material/IosShare';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/material/styles/useTheme';
import FaceIcon from '@mui/icons-material/Face';
import Button from '@mui/material/Button';
import ContentCut from '@mui/icons-material/ContentCut';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import LogoutIcon from '@mui/icons-material/Logout';
import { ListItemIcon } from '@mui/material';
/** IF ITEM ID IN THE RESPONSE STAYS IN AN ORDER, THEN THAT WILL KEEP THINGS EASY
 *  SINCE I DO NOT HAVE TO ITERATE THROUGH THINGS.
 * 
 * @param {*} props 
 * @returns 
 */
const ReceiptBreakdown = (props) => {
    const data = props.data;
    const setData = props.setData;
    const hubUrl = props.chatHubUrl
    const claimedTotal = getClaimedTotal(data.items, data.tip, data.tax);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [selectedName, setSelectedName] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [itemData, setItemData] = useState(data);
    const [showModal, setShowModal] = useState(false); // Summary modal
    const [showShare, setShowShare] = useState(false); // Share modal
    const [showAddItem, setShowAddItem] = useState(false); // Edit modal
    const [showAddUser, setShowAddUser] = useState(false); // Add User modal
    const [receiptId, setReceiptId] = useState(getUrlId());
    const [showItemBreakdown, setShowItemBreakdown] = useState(false);
    const [userClaimedTotal, setUserClaimedTotal] = useState(0);
    const [userSelectedItems, setUserSelectedItems] = useState([]);
    
    const connection = useSignalR();



    useEffect(() => {
        //everytime there is a change
        if(data !== null && data !== undefined){
            if(data.items !== null && data.items !== undefined && data.items.length > 0){
                setShowItemBreakdown(true);
            }
        }
    },[])

    useEffect(() => {
        if(selectedName !== "") {
            updateUserClaimsAndTotal();
           
        }
    },[selectedName,itemData])

    useEffect(() => {
        if (connection) {
            // Handle SignalR events here
            console.log("in connection use effect conditional")
            connection.on("GroupReceiptUpdate", (receiptDto) => {
                console.log("receipt update received: " );
                console.log(receiptDto);
                setData(receiptDto);
                setItemData(receiptDto);
                ///setItemData(receiptDto);
                //updateUserClaimsAndTotal();
                connection.invoke("GroupUpdateReceived", receiptDto._id, connection.connectionId)
            
            })
        }
    }, [connection]);


    const updateUserClaimsAndTotal = () => {
        setUserClaimedTotal(getUserClaimedTotal(itemData.items, 
            itemData.users.find(user => user.name === selectedName))); 

        const userItems = itemData.items.filter(item => item.claims.find(claim => claim.userId === itemData.users.find(user => user.name === selectedName).userId));
        setUserSelectedItems(userItems.map(item => item.itemId));
    }


    const handleAddNewItem = async () => {
        console.log("add item button clicked in handleAddNewItem")
        setShowAddItem(true);
    }
  
    const handleSelectUser = (user) => {
        setSelectedUser(user);
        setSelectedName(user.name);
        setAnchorEl(null);
    };

    const handleAddUser = () => {
        console.log("add user button clicked in handleAddUser")
        setShowAddUser(true);
        setAnchorEl(null);
    }

    const handleUsersClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDeleteUser = (user) => {
        console.log("delete user button clicked in handleDeleteUser")
    }

    const renderUserMenu = () => (
        <Box>
            
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            {data.users.map((user, index) => (
                <Box key={index} sx={{ display: 'flex', width: '100%',  alignItems: 'center', justifyContent: 'space-between',
                    flexDirection: 'row', pr:2}}>
                    <Box sx={{ display: 'flex', width: '100%',  alignItems: 'center', justifyContent: 'center',
                                            flexDirection: 'row'}}>
                 
                        <MenuItem key={index} onClick={() => handleSelectUser(user)} sx={{ flexGrow: 1 }}>
                            <ListItemIcon>
                                <FaceIcon fontSize="small" />
                            </ListItemIcon>
                            {user.name}
                        </MenuItem>
                        <IconButton edge="end" color="inherit" onClick={() => handleDeleteUser(user)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                   
                  
                    
                </Box>
            ))}
            
            <MenuItem onClick={handleAddUser}>
                <ListItemIcon>
                    <PersonAddAltIcon fontSize="small" />
                </ListItemIcon>
                Add User
            </MenuItem>
            
        </Menu>
    </Box>
        
    );

    const receiptItems = () => {
        return (
            <>
                <List id='reciept-list' className="w-100">
                {
                    itemData?.items?.map((item, index) => (                   
                        <ReceiptItem
                        item={item}
                        index={index}
                        users={itemData.users}
                        selectedName={selectedName}
                        userSelectedItems={userSelectedItems}
                        receiptId={itemData._id}>
                        </ReceiptItem>                   
                    ))
                }
                </List>
            </>
        )

    }


    const handleShare = async () => {
        if (navigator.share) {
            const linkToShare = window.location.origin + "/input/?receiptId=" + receiptId;
            
            try {
                await navigator.share({
                    title: 'Tabman Receipt Share',
                    text: "Let's split this receipt!",
                    url: linkToShare,
                });
                console.log('Content shared successfully');
            } catch (error) {
                console.error('Error sharing content:', error);
            }
        } else {
            console.log('Web Share API is not supported in this browser.');
        }
    }


    if (showItemBreakdown !== null && showItemBreakdown !== undefined && showItemBreakdown === true) {
        return(
            <>
             <Box sx={{ flexGrow: 1 }}>
                        <AppBar position="fixed" sx={{ bgcolor: 'background.paper', boxShadow: 'none' }}>
                            <Toolbar>
                            <Typography variant="h6" noWrap component="a" href="/" sx={{ mr: 2, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '.3rem', color: 'primary.main', textDecoration: 'none' }}>
                                    CheckMates
                                </Typography>
                                <Box sx={{ flexGrow: 1 }} />

                            <Button color="primary" variant="text"  >Login</Button>
                            </Toolbar>
                        </AppBar>
                    </Box>

                <Container fixed sx={{ display: 'flex',  alignItems: 'center', justifyContent: 'center',
                        flexDirection: 'column', width: '100%'
                     }}>
                <Box id="header-box" sx={{ display: 'flex',  alignItems: 'center', justifyContent: 'center',
                            flexDirection: 'column', position: 'sticky', top: isMobile ? 54 : 64, zIndex: 1, 
                            bgcolor: 'background.paper', width: '100%'}}>
                    <Typography sx={{ fontFamily: 'monospace', m: isMobile ? 1.5 : 2, fontWeight: 700, color: 'text.primary', textDecoration: 'none',
                        fontSize: isMobile ? '1.25rem' : '1.5rem'
                     }}>
                                {"Receipt Breakdown"}
                    </Typography>
                    
                </Box>
                <Box id="summary-box" sx={{display: 'flex',  alignItems: 'center', justifyContent: 'center',
                            flexDirection: 'row', position: 'sticky', top: isMobile ? 100 : 124, zIndex: 1, bgcolor: 'background.paper', width: '100%'}}>
                    <Typography sx={{ fontFamily: 'monospace', fontWeight: 400, color: 'text.primary', textDecoration: 'none',
                        fontSize: isMobile ? '.8rem' : '1rem', m: isMobile ? 1 : 2
                     }}>
                    {"Total: $" + data.total.toFixed(2)}
                    </Typography>
                    <Typography sx={{ fontFamily: 'monospace', fontWeight: 400, color: 'text.primary', textDecoration: 'none',
                        fontSize: isMobile ? '.8rem' : '1rem', m: isMobile ? 1 : 2
                     }}>
                    {"Claimed: $" + claimedTotal.toFixed(2)}
                    </Typography>
                    {(selectedName) && (
                    <Typography sx={{ fontFamily: 'monospace',  fontWeight: 400, color: 'text.primary', textDecoration: 'none',
                        fontSize: isMobile ? '.8rem' : '1rem', m: isMobile ? 1 : 2
                     }}>
                    {selectedName + ": $" + userClaimedTotal.toFixed(2)}
                    </Typography>)}
                </Box>
                
                <Box sx={{ display: 'flex', width: '100%',  alignItems: 'center', justifyContent: 'center',
                            flexDirection: 'row', mt: isMobile ? '5rem' : '5rem', mb: isMobile ? '7rem' : '7rem'}}>
                                {receiptItems()}
                                </Box>
                    </Container>
                <SummaryModal show={showModal} setShow={setShowModal} total={data.total} claimedTotal={claimedTotal} data={data} />
                <ShareModal show={showShare} setShow={setShowShare} receiptId={receiptId} />
                <AddNewItemModal show={showAddItem} setShow={setShowAddItem} receiptId={receiptId} />
                <AddUserModal show={showAddUser} setShow={setShowAddUser} receiptId={receiptId} />
                {renderUserMenu()}
                    
       
 
                
                <Paper sx={{ position: 'fixed', display:'flex', justifyContent:'center',  bottom: 0, left: 0, right: 0, height: 80 }} elevation={3}>
                    <BottomNavigation
                    showLabels
                    sx={{height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'start'}}
                    >
                    <BottomNavigationAction label={selectedName || "Users"} icon={selectedName ? <FaceIcon/> : <GroupIcon />} onClick={handleUsersClick} />
                    <BottomNavigationAction label="Add Item" onClick={() => handleAddNewItem()} icon={<AddCircleOutlineIcon />} />
                    <BottomNavigationAction label="Summary" onClick={() => setShowModal(true)} icon={<CheckCircleOutlineIcon />} />
                    <BottomNavigationAction label="Share" onClick={() => handleShare()} icon={<IosShareIcon />} />
                    
                    IosShareIcon
                    </BottomNavigation>
                </Paper>
                
            </>
        );
    }else{
        return(
            <>
            <Navbar id='nav-container' bg="dark" data-bs-theme="dark" sticky="top" >
                <Container>
                    <Navbar.Text id='error-id'>no items to show</Navbar.Text>
                    
                </Container>

            </Navbar>

          
            </>
        );
 
    }
    
}

//export default ReceiptBreakdown;
const ReceiptBreakdownWrapper = (props) => {
    return (
        <SignalRProvider chatHubUrl={props.chatHubUrl} receiptId={props.receiptId}>
            <ReceiptBreakdown 
            data={props.data}
            setData={props.setData}
            chatHubUrl={props.chatHubUrl} />
        </SignalRProvider>
    );
};
export default ReceiptBreakdownWrapper;

