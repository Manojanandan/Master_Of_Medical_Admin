import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Titlebar from '../../comnponents/titlebar/Titlebar'
import { Alert, Backdrop, Box, Button, CircularProgress, Grid2, IconButton, Paper, TextField, Typography } from '@mui/material'
import { Editor } from 'react-draft-wysiwyg';
import { ContentState, convertToRaw, EditorState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close'
import { getOneBlogData, postBlogData, putBlogData } from './BlogReducer';
import draftToHtml from 'draftjs-to-html';
import { useDispatch, useSelector } from 'react-redux';
import htmlToDraft from 'html-to-draftjs';

const BlogEntry = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const fileInputRef = useRef()
    const bannerInputRef = useRef()
    const useQuery = new URLSearchParams(useLocation().search)
    const blogId = useQuery.get("blogId")
    const mode = useQuery.get("Mode")
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [featureImage, setFeatureImage] = useState(null)
    const [bannerImage, setBannerImage] = useState(null);
    const [title, setTitle] = useState("")
    const [metaTitle, setMetaTitle] = useState("")
    const [metaDescription, setMetaDescription] = useState("")

    const rawContent = convertToRaw(editorState.getCurrentContent())
    const editorContent = draftToHtml(rawContent)

    const reducerResponse = useSelector((state) => state.blog)
    const Load = reducerResponse?.load
    const successMsg = reducerResponse?.message
    const getOneData = reducerResponse?.getOneData?.data

    const handleFeatureImgChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFeatureImage(e.target.files[0])
            // setErrorMsg({ ...errorMsg, profileImgError: "" })
        }
    }
    const handleRemoveProfileImg = (e) => {
        e.stopPropagation()
        setFeatureImage(null)
    }
    const handleBannerImgChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setBannerImage(e.target.files[0])
            // setErrorMsg({ ...errorMsg, profileImgError: "" })
        }
    }
    const handleRemoveBannerImg = (e) => {
        e.stopPropagation()
        setBannerImage(null)
    }

    useEffect(() => {
        if (mode !== "Add") {
            dispatch(getOneBlogData(blogId))
        } else {
            setEditorState(EditorState.createEmpty());
        }
    }, [])

    useEffect(() => {
        if (successMsg) {
            const timer = setTimeout(() => {
                navigate('/blog');
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [successMsg, navigate]);

    useMemo(() => {
        if (getOneData) {
            const resolveImagePath = () => {
                if (!getOneData?.image) return null;

                let imagePath = getOneData.image;

                if (typeof imagePath === 'object' && imagePath?.path) {
                    imagePath = imagePath.path;
                } else if (Array.isArray(imagePath)) {
                    imagePath = imagePath[0];
                }

                return typeof imagePath === 'string'
                    ? (imagePath.startsWith('http') ? imagePath : `http://luxcycs.com:5500/${imagePath}`)
                    : null;
            };
            setFeatureImage(resolveImagePath);
            setBannerImage(bannerImage)
            setTitle(getOneData?.title)
            setMetaTitle(getOneData?.metaTitle)
            setMetaDescription(getOneData?.metaDescription)
            if (getOneData?.content) {
                const contentBlock = htmlToDraft(getOneData?.content);
                if (contentBlock) {
                    const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                    const newEditorState = EditorState.createWithContent(contentState);
                    setEditorState(newEditorState);
                }
            }
        }
    }, [getOneData])

    const handleSubmit = () => {
        const formData = new FormData()

        if (mode !== "Add") {
            formData.append("id", blogId)
        }

        formData.append("title", title)
        formData.append("metaTitle", metaTitle)
        formData.append("metaDescription", metaDescription)
        formData.append("author", "abcd")
        formData.append("featureImage", featureImage)
        formData.append("bannerImage", bannerImage)
        formData.append("content", editorContent)

        if (mode === "Add") {
            dispatch(postBlogData(formData))
        } else {
            dispatch(putBlogData((formData)))
        }
    }

    // const handleClear = () => {
    //     setTitle("")
    //     setBannerImage(null)
    //     setFeatureImage(null)
    //     setMetaDescription("")
    //     setMetaTitle("")
    //     setEditorState(EditorState.createEmpty());
    // }

    return (
        <React.Fragment>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={Load}
            >
                <CircularProgress color="secondary" />
            </Backdrop>
            <Titlebar title={"Blog Details"} filter={false} back={true} backClick={() => navigate('/blog')} />
            {successMsg &&
                <Alert variant="filled" severity="success" sx={{ margin: '15px auto', width: '95%', fontSize: '16px' }}>
                    {successMsg}
                </Alert>
            }
            <Paper elevation={5} sx={{ width: '95%', margin: '2% auto', height: 'auto', borderRadius: '10px', padding: '2% 3%' }}>
                <Grid2 container columnSpacing={4} rowSpacing={3}>
                    <Grid2 size={6} >
                        <Typography variant='p' sx={{ fontWeight: 'bold', }}>Blog Title <span style={{ color: 'red' }}>*</span></Typography><br />
                        <TextField
                            id="title"
                            size="small"
                            sx={{ margin: '2% 0' }}
                            autoComplete='off'
                            fullWidth
                            placeholder='Enter Blog title'
                            onChange={(e) => setTitle(e.target.value)}
                            value={title ?? ""}
                            disabled={mode === "View" ? true : ""}
                        />
                    </Grid2>
                    <Grid2 size={12} >
                        <Typography variant='p' sx={{ fontWeight: 'bold', }}>Blog Content <span style={{ color: 'red' }}>*</span></Typography><br />
                        <Box sx={{ height: '400px', width: '8%0px', border: 'solid 1.5px #2424', margin: '10px 0', padding: '5px', backgroundColor: '#fff' }}>
                            <Editor
                                editorState={editorState}
                                onEditorStateChange={setEditorState}
                                toolbar={{
                                    options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove', 'history'],
                                    blockType: { options: ['Normal', 'H1', 'H2', 'H3', 'Blockquote', 'Code',] },
                                    inline: { inDropdown: false },
                                    list: { inDropdown: false },
                                    textAlign: { inDropdown: false },
                                    link: { inDropdown: false },
                                    history: { inDropdown: false },
                                }}
                                placeholder='Start Typing..'
                                wrapperClassName="demo-wrapper"
                                editorClassName="demo-editor"
                                toolbarClassName="custom-toolbar"
                                readOnly={mode === "View" ? true : ""}
                            />
                        </Box>
                    </Grid2>
                    <Grid2 size={6} >
                        <Typography variant='p' sx={{ fontWeight: 'bold', }}>Feature Image <span style={{ color: 'red' }}>*</span></Typography><br />
                        <Box
                            sx={{
                                border: '2px dashed #00bfae',
                                borderRadius: '10px',
                                padding: '32px',
                                textAlign: 'center',
                                backgroundColor: '#f8fafc',
                                position: 'relative',
                                cursor: featureImage ? 'default' : 'pointer',
                                minHeight: 120,
                                marginTop: 1,
                            }}
                            onClick={() => {
                                if (!featureImage) fileInputRef.current.click();
                            }}
                        >
                            {/* Upload Box */}
                            {!featureImage && (
                                <>
                                    <CloudUploadIcon sx={{ fontSize: 48, color: '#00bfae' }} />
                                    <Typography sx={{ mt: 1, mb: 1, fontWeight: 600, color: '#00bfae', fontSize: '20px' }}>
                                        Upload Profile
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        sx={{ backgroundColor: '#00bfae', color: '#fff', mt: 1, fontWeight: 'bold' }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            fileInputRef.current.click();
                                        }}
                                    >
                                        BROWSE
                                    </Button>
                                    <Typography sx={{ mt: 2, color: '#888', fontSize: 13 }}>
                                        Note: Only image files allowed. Max 5MB.
                                    </Typography>
                                </>
                            )}

                            {/* File Input */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleFeatureImgChange}
                            />

                            {/* Preview Box */}
                            {featureImage && (
                                <Box
                                    sx={{
                                        mt: 0,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        position: 'relative',
                                    }}
                                >
                                    {/* Image Source Logic */}
                                    {(() => {
                                        let imageSrc = null;

                                        if (typeof featureImage === 'string' && featureImage !== '') {
                                            imageSrc = featureImage.startsWith('http')
                                                ? featureImage
                                                : `http://luxcycs.com:5500/${featureImage}`;
                                        } else if (featureImage instanceof File) {
                                            imageSrc = URL.createObjectURL(featureImage);
                                        }

                                        return (
                                            imageSrc && (
                                                <img
                                                    src={imageSrc}
                                                    alt="Thumbnail Preview"
                                                    style={{
                                                        maxWidth: 120,
                                                        maxHeight: 120,
                                                        borderRadius: 8,
                                                        marginTop: 8,
                                                        objectFit: 'cover',
                                                    }}
                                                />
                                            )
                                        );
                                    })()}

                                    {/* File Name */}
                                    <Typography sx={{ fontSize: 13, mt: 1 }}>
                                        {typeof featureImage === 'string'
                                            ? featureImage.split('/').pop()
                                            : featureImage?.name}
                                    </Typography>

                                    {/* Remove Button */}
                                    {mode !== 'View' && (
                                        <IconButton
                                            size="small"
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                right: 0,
                                                background: '#fff',
                                                border: '1px solid #ccc',
                                                '&:hover': { background: '#f8fafc' },
                                            }}
                                            onClick={handleRemoveProfileImg}
                                        >
                                            <CloseIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                </Box>
                            )}
                        </Box>
                    </Grid2>
                    <Grid2 size={6} >
                        <Typography variant='p' sx={{ fontWeight: 'bold', }}>Banner Image <span style={{ color: 'red' }}>*</span></Typography><br />
                        <Box
                            sx={{
                                border: '2px dashed #00bfae',
                                borderRadius: '10px',
                                padding: '32px',
                                textAlign: 'center',
                                backgroundColor: '#f8fafc',
                                position: 'relative',
                                cursor: featureImage ? 'default' : 'pointer',
                                minHeight: 120,
                                marginTop: 1,
                            }}
                            onClick={() => {
                                if (!bannerImage) bannerInputRef.current.click();
                            }}
                        >
                            {/* Upload Box */}
                            {!bannerImage && (
                                <>
                                    <CloudUploadIcon sx={{ fontSize: 48, color: '#00bfae' }} />
                                    <Typography sx={{ mt: 1, mb: 1, fontWeight: 600, color: '#00bfae', fontSize: '20px' }}>
                                        Upload Profile
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        sx={{ backgroundColor: '#00bfae', color: '#fff', mt: 1, fontWeight: 'bold' }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            bannerInputRef.current.click();
                                        }}
                                    >
                                        BROWSE
                                    </Button>
                                    <Typography sx={{ mt: 2, color: '#888', fontSize: 13 }}>
                                        Note: Only image files allowed. Max 5MB.
                                    </Typography>
                                </>
                            )}

                            {/* File Input */}
                            <input
                                ref={bannerInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleBannerImgChange}
                            />

                            {/* Preview Box */}
                            {bannerImage && (
                                <Box
                                    sx={{
                                        mt: 0,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        position: 'relative',
                                    }}
                                >
                                    {/* Image Source Logic */}
                                    {(() => {
                                        let imageSrc = null;

                                        if (typeof bannerImage === 'string' && bannerImage !== '') {
                                            imageSrc = bannerImage.startsWith('http')
                                                ? bannerImage
                                                : `http://luxcycs.com:5500/${bannerImage}`;
                                        } else if (bannerImage instanceof File) {
                                            imageSrc = URL.createObjectURL(bannerImage);
                                        }

                                        return (
                                            imageSrc && (
                                                <img
                                                    src={imageSrc}
                                                    alt="Thumbnail Preview"
                                                    style={{
                                                        maxWidth: 120,
                                                        maxHeight: 120,
                                                        borderRadius: 8,
                                                        marginTop: 8,
                                                        objectFit: 'cover',
                                                    }}
                                                />
                                            )
                                        );
                                    })()}

                                    {/* File Name */}
                                    <Typography sx={{ fontSize: 13, mt: 1 }}>
                                        {typeof bannerImage === 'string'
                                            ? bannerImage.split('/').pop()
                                            : bannerImage?.name}
                                    </Typography>

                                    {/* Remove Button */}
                                    {mode !== 'View' && (
                                        <IconButton
                                            size="small"
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                right: 0,
                                                background: '#fff',
                                                border: '1px solid #ccc',
                                                '&:hover': { background: '#f8fafc' },
                                            }}
                                            onClick={handleRemoveBannerImg}
                                        >
                                            <CloseIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                </Box>
                            )}
                        </Box>
                    </Grid2>
                    <Grid2 size={6} >
                        <Typography variant='p' sx={{ fontWeight: 'bold', }}>Meta Title <span style={{ color: 'red' }}>*</span></Typography><br />
                        <TextField
                            id="name"
                            size="small"
                            sx={{ margin: '2% 0' }}
                            autoComplete='off'
                            fullWidth
                            placeholder='Enter Meta title'
                            onChange={(e) => setMetaTitle(e.target.value)}
                            value={metaTitle ?? ""}
                            disabled={mode === "View" ? true : ""}
                        />
                    </Grid2>
                    <Grid2 size={6} >
                        <Typography variant='p' sx={{ fontWeight: 'bold', }}>Meta Description <span style={{ color: 'red' }}>*</span></Typography><br />
                        <TextField
                            id="name"
                            size="small"
                            sx={{ margin: '2% 0' }}
                            autoComplete='off'
                            fullWidth
                            placeholder='Enter Meta Decription'
                            onChange={(e) => setMetaDescription(e.target.value)}
                            value={metaDescription ?? ""}
                            disabled={mode === "View" ? true : ""}
                        />
                    </Grid2>
                    {mode !== "View" &&
                        <Grid2 size={12} sx={{ marginBottom: '10px',textAlign:'right' }}>
                            <Button variant='contained' sx={{ padding: '5px 20px', fontSize: '16px', backgroundColor: '#00bfae', fontWeight: 'bold' }} onClick={handleSubmit}>Add Blog</Button>
                            {/* <Button variant='contained' sx={{ marginLeft: '20px', textTransform: 'capitalize', backgroundColor: '#868787', padding: '5px 20px', fontWeight: 'bold', fontSize: '16px', }} onClick={handleClear}>Clear</Button> */}
                        </Grid2>
                    }

                </Grid2>
            </Paper>
        </React.Fragment>
    )
}

export default BlogEntry