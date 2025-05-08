import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Titlebar from '../../comnponents/titlebar/Titlebar'
import { Alert, Backdrop, Box, Button, CircularProgress, Grid2, TextField, Typography } from '@mui/material'
import { Editor } from 'react-draft-wysiwyg';
import { ContentState, convertToRaw, EditorState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { styled } from '@mui/material/styles';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { getOneBlogData, postBlogData, putBlogData } from './BlogReducer';
import draftToHtml from 'draftjs-to-html';
import { useDispatch, useSelector } from 'react-redux';
import htmlToDraft from 'html-to-draftjs';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});


const BlogEntry = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const useQuery = new URLSearchParams(useLocation().search)
    const blogId = useQuery.get("blogId")
    const mode = useQuery.get("Mode")
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [featureImage, setFeatureImage] = useState(null);
    const [featureImageFile, setFeatureImageFile] = useState(null);
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


    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
            const previewUrl = URL.createObjectURL(file);
            setFeatureImage(previewUrl);
            setFeatureImageFile(file);
        } else {
            alert('Please select a PNG or JPEG image.');
            setFeatureImage(null);
            setFeatureImageFile(null);
        }
    };
    const handleBannerFileChange = (event) => {
        const file = event.target.files[0];
        if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
            const previewUrl = URL.createObjectURL(file);
            setBannerImage(previewUrl);
        } else {
            alert('Please select a PNG or JPEG image.');
            setBannerImage(null);
        }
    };

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
        setFeatureImage(getOneData?.image)
        setFeatureImageFile(getOneData?.image)
        setBannerImage(null)
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
        formData.append("image", featureImageFile)
        formData.append("content", editorContent)

        if (mode === "Add") {
            dispatch(postBlogData(formData))
        } else {
            dispatch(putBlogData((formData)))
        }
    }

    const handleClear = () => {
        setTitle("")
        setBannerImage(null)
        setFeatureImage(null)
        setFeatureImageFile(null)
        setMetaDescription("")
        setMetaTitle("")
        setEditorState(EditorState.createEmpty());
    }

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
            <Box sx={{ height: '100%', width: '92%', margin: '2% auto', }}>
                <Grid2 container>
                    <Grid2 size={{ xs: 2, sm: 4, md: 8 }} sx={{ marginBottom: '10px' }}>
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
                    <Grid2 size={{ xs: 2, sm: 4, md: 12 }} sx={{ marginBottom: '10px' }}>
                        <Typography variant='p' sx={{ fontWeight: 'bold', }}>Blog Content <span style={{ color: 'red' }}>*</span></Typography><br />
                        <Box sx={{ height: '400px', width: '800px', border: 'solid 1.5px #2424', margin: '10px 0', padding: '5px', backgroundColor: '#fff' }}>
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
                    <Grid2 size={{ xs: 2, sm: 4, md: 8 }} sx={{ marginBottom: '10px' }}>
                        <Typography variant='p' sx={{ fontWeight: 'bold', }}>Feature Image <span style={{ color: 'red' }}>*</span></Typography><br />
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Button
                                sx={{ margin: '10px 0', textTransform: 'capitalize', fontSize: '16px', backgroundColor: '#02998e' }}
                                component="label"
                                variant="contained"
                                tabIndex={-1}
                                startIcon={<CloudUploadIcon />}
                                disabled={mode === "View" ? true : ""}
                            >
                                Upload
                                <VisuallyHiddenInput
                                    type="file"
                                    accept="image/png, image/jpeg" // Restrict file types to PNG and JPEG
                                    onChange={handleFileChange}
                                />
                            </Button>
                            {featureImage && (
                                <div style={{ marginLeft: '10%' }}>
                                    <img
                                        src={featureImage}
                                        alt={featureImage}
                                        style={{
                                            width: '200px',
                                            height: 'auto',
                                        }}
                                    />
                                </div>
                            )}
                        </Box>
                    </Grid2>
                    <Grid2 size={{ xs: 2, sm: 4, md: 8 }} sx={{ marginBottom: '10px' }}>
                        <Typography variant='p' sx={{ fontWeight: 'bold', }}>Banner Image <span style={{ color: 'red' }}>*</span></Typography><br />
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Button
                                sx={{ margin: '10px 0', textTransform: 'capitalize', fontSize: '16px', backgroundColor: '#9b2f7d' }}
                                component="label"
                                variant="contained"
                                tabIndex={-1}
                                startIcon={<CloudUploadIcon />}
                                disabled={mode === "View" ? true : ""}
                            >
                                Upload
                                <VisuallyHiddenInput
                                    type="file"
                                    accept="image/png, image/jpeg" // Restrict file types to PNG and JPEG
                                    onChange={handleBannerFileChange}


                                />
                            </Button>
                            {bannerImage && (
                                <div style={{ marginLeft: '10%' }}>
                                    <img
                                        src={bannerImage}
                                        alt={bannerImage}
                                        style={{
                                            width: '400px',
                                            height: 'auto',
                                        }}
                                    />
                                </div>
                            )}
                        </Box>
                    </Grid2>
                    <Grid2 size={{ xs: 2, sm: 4, md: 8 }} sx={{ marginBottom: '10px' }}>
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
                    <Grid2 size={{ xs: 2, sm: 4, md: 8 }} sx={{ marginBottom: '10px' }}>
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
                        <Grid2 size={{ xs: 2, sm: 4, md: 6 }} sx={{ marginBottom: '10px', }}>
                            <Button variant='contained' sx={{ textTransform: 'capitalize', padding: '5px 20px', fontSize: '16px', backgroundColor: '#9b2f7d', fontWeight: 'bold' }} onClick={handleSubmit}>Submit</Button>
                            <Button variant='contained' sx={{ marginLeft: '20px', textTransform: 'capitalize', backgroundColor: '#868787', padding: '5px 20px', fontWeight: 'bold', fontSize: '16px', }} onClick={handleClear}>Clear</Button>
                        </Grid2>
                    }

                </Grid2>
            </Box>
        </React.Fragment>
    )
}

export default BlogEntry