import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { summarize } from '../HelperFunctions';
import { Divider, Typography, Box, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/material/styles/useTheme';

const SummaryModal = (props) => {
    const {show, setShow, total, claimedTotal, data} = props;
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const items = data.items;
    //const users = data.users;
    const tax = data.tax;
    const users = data.users;

    const getClaimedItemData = (summary, currentUserId) => {
        return summary[currentUserId]?.claimedItems?.map((item, index) => {
            return (
                <>
                <Box sx={{display: 'flex',  alignItems: 'center', justifyContent: 'space-between',
                    flexDirection: 'row', bgcolor: 'background.paper', width: '100%'}}>
                    <Box sx={{display: 'flex',  alignItems: 'center', justifyContent: 'start',
                    flexDirection: 'row', bgcolor: 'background.paper', width: '100%'}}>
                    <Typography sx={{ fontFamily: 'monospace', fontWeight: 400, color: 'primary', textDecoration: 'none',
                        fontSize: isMobile ? '0.65rem' : '.75rem'
                    }}>
                    {item.name}
                    </Typography>
                    <Box sx={{display: 'flex',  alignItems: 'center', justifyContent: 'end',
                    flexDirection: 'row', bgcolor: 'background.paper', width: '100%'}}>
                    <Typography sx={{ fontFamily: 'monospace', fontWeight: 400, color: 'primary', textDecoration: 'none',
                        fontSize: isMobile ? '0.65rem' : '.75rem'
                    }}>
                    {item.split === 1 ? "$" + item.price.toFixed(2) : "split by " + item.split + " - " + "$" +item.price.toFixed(2)} 
                    </Typography>
                    </Box>
                    </Box>
                    {/* <Box sx={{display: 'flex',  alignItems: 'center', justifyContent: 'end',
                    flexDirection: 'row', bgcolor: 'background.paper', width: '100%'}}>
                        <Typography sx={{ fontFamily: 'monospace', fontWeight: 400, color: 'primary', textDecoration: 'none',
                            fontSize: isMobile ? '0.6rem' : '.75rem', m: isMobile ? .5 : 1
                        }}>
                        {"split by " + item.split + " - " + "$" +item.price.toFixed(2)}
                        </Typography>
                    </Box> */}
                </Box>
                <Divider variant="middle" orientation="horizontal" sx={{ width: '100%', my: 0, borderWidth: '1px' }}/>
                </>
                // <div key={index} id={currentUserId + '-item-' + index} className='item-row'>
                //     <i>{item.name}</i>
                //     { item.split === 1 ? 
                //     <i>${item.price.toFixed(2)}</i> : 
                //     <i>split by {item.split} - ${item.price.toFixed(2)}</i>
                //     }
                // </div>
            )
        })
    }

    const getUserRowSummary = () => {
        console.log("users in getUserRowSummary: " + users)
        const summary = summarize(users, items, data.tip, data.tax);
        console.log("in getUserRowSummary after summarize");
        return data?.users?.map((user, index) => {
     
            return (
                <>
                <Box sx={{display: 'flex',  alignItems: 'center', justifyContent: 'center',
                            flexDirection: 'column', bgcolor: 'background.paper', width: '100%'}}>
                    <Box sx={{display: 'flex',  alignItems: 'center', justifyContent: 'center',
                                flexDirection: 'row', bgcolor: 'background.paper', width: '100%'}}>
                            <Box sx={{display: 'flex',  alignItems: 'center', justifyContent: 'start',
                                flexDirection: 'row', bgcolor: 'background.paper', width: '100%'}}>
                        <Typography sx={{ fontFamily: 'monospace', fontWeight: 900, color: 'primary', textDecoration: 'none',
                            fontSize: isMobile ? '0.75rem' : '1rem'
                        }}>
                        {user.name}
                        </Typography>
                        </Box>
                        <Box sx={{display: 'flex',  alignItems: 'center', justifyContent: 'end',
                                flexDirection: 'row', bgcolor: 'background.paper', width: '100%'}}>
                        <Typography sx={{ fontFamily: 'monospace', fontWeight: 900, color: 'primary', textDecoration: 'none',
                            fontSize: isMobile ? '0.75rem' : '1rem'
                        }}>
                        ${summary[user.userId]?.claimedTotal.toFixed(2)}
                        </Typography>
                        </Box>   
                    </Box>
                    <Divider variant="middle" orientation="horizontal" sx={{ width: '100%', m:0, borderWidth: '2px' }}/>
                    <Box sx={{display: 'flex',  alignItems: 'center', justifyContent: 'space-between',
                                flexDirection: 'column', bgcolor: 'background.paper', width: '100%', mb:3}}>
                            
                            { getClaimedItemData(summary, user.userId) }
                        
                    </Box>
                </Box>
                 
                </>
               
            )
        })
    }

    return (
        <>
               <Dialog open={show} onClose={() => setShow(false)}
                 fullWidth={true}
                 maxWidth={'sm'}
                >
                    <DialogTitle>Summary</DialogTitle>
                    <DialogContent>
                    {getUserRowSummary()}
                <Box sx={{display: 'flex',  alignItems: 'center', justifyContent: 'center',
                                flexDirection: 'column', bgcolor: 'background.paper', width: '100%'}}>
                    
                        <Typography sx={{ fontFamily: 'monospace', fontWeight: 900, color: 'primary', textDecoration: 'none',
                                    fontSize: isMobile ? '.75rem' : '1rem', mr: 2, ml:2
                                }}>
                                {"Total: $" +total.toFixed(2)}
                        </Typography>
                    
               
                <Typography sx={{ fontFamily: 'monospace', fontWeight: 900, color: 'primary', textDecoration: 'none',
                            fontSize: isMobile ? '.75rem' : '1rem', mr: 2, ml:2
                        }}>
                        {"Claimed Total: $"+claimedTotal.toFixed(2)}
                </Typography>
                
            
                    
                </Box>
                  </DialogContent>
                  <DialogActions>
                    <Button variant="text" onClick={() => setShow(false)}>Close</Button>
                
                  </DialogActions>
        </Dialog>
        {/* <Modal show={show} onHide={() => setShow(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Summary</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {getUserRowSummary()}
                <div id='final-row'>
                    <b>Total: ${total.toFixed(2)}</b>
                    <b>Claimed Total: ${claimedTotal.toFixed(2)}</b>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShow(false)}>
                    Close
                </Button>
            </Modal.Footer>
      </Modal> */}
      </>
    );
}

export default SummaryModal;