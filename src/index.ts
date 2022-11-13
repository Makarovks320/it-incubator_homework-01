import express, {Request, Response} from 'express';

const app = express();
const PORT = process.env.PORT || 3000;
const jsonParser = express.json();
app.use(jsonParser);

enum Resolution {
    P144 = 'P144',
    P240 = 'P240',
    P360 = 'P360',
    P480 = 'P480',
    P720 = 'P720',
    P1080 = 'P1080',
    P1440 = 'P1440',
    P2160 = 'P2160'
};
type res = Resolution | null;
type video = {
    id: number,
    title: string,
    author: string,
    canBeDownloaded?: boolean,
    minAgeRestriction?: number | null, // max: 18 min: 1 default: null
    createdAt?: string,
    publicationDate?: string,
    availableResolutions?: res[]
};
type errorMessage = {
    message: string,
    field: string
};
type errorsList = {
    errorsMessages: errorMessage[]
};

const db: { videos: video[] } = {
    videos: [
        {
            id: 0,
            title: "string",
            author: "string",
            canBeDownloaded: true,
            minAgeRestriction: null,
            createdAt: "2022-11-13T17:46:08.982Z",
            publicationDate: "2022-11-13T17:46:08.982Z",
            availableResolutions: [Resolution.P144]
        },
        {
            id: 1,
            title: 'qqqqqq',
            author: 'asdasd'
        },
        {
            id: 2,
            title: 'lolol',
            author: 'plplplpl'
        }
    ]
}

app.get('/', (req: Request, res: Response) => {
    res.send('HELLO!');
})
app.get('/videos', (req: Request, res: Response) => {
    res.status(200).send(db.videos);
})
app.delete('/videos', (req: Request, res: Response) => {
    db.videos = [];
    res.status(204).send('All data is deleted');
})
app.post('/videos', (req: Request, res: Response) => {
    const newVideo: video = req.body;
    const validationResult = validateVideo(newVideo);
    if(validationResult.errorsMessages.length > 0) {
        res.status(400).send(validationResult);
    }
    const newId = db.videos.length;
    newVideo.id = newId;
    db.videos.push(newVideo);
    res.status(200).send(db.videos[0]);
})
app.listen(PORT, () => {
    console.log(`server is running at ${PORT}`)
})

function validateVideo(video: video): errorsList {
    const result: errorsList = {errorsMessages: []};
    if (!video.title.trim() || typeof video.title !== 'string') {
        result.errorsMessages.push({
            message: 'field is missed or has an incorrect value',
            field: 'title'
        })
    }
    if (!video.author.trim() || typeof video.title !== 'string') {
        result.errorsMessages.push({
            message: 'field is missed or has an incorrect value',
            field: 'author'
        })
    }
    if (video.canBeDownloaded && typeof video.canBeDownloaded !== 'boolean') {
        result.errorsMessages.push({
            message: 'incorrect type',
            field: 'canBeDownloaded'
        })
    }
    if (video.minAgeRestriction) {
        if (typeof video.minAgeRestriction !== 'number') {
            result.errorsMessages.push({
                message: 'incorrect type',
                field: 'minAgeRestriction'
            })
        } else {
            if (video.minAgeRestriction < 1 || video.minAgeRestriction > 18) {
                result.errorsMessages.push({
                    message: 'value should be between 1 and 18',
                    field: 'minAgeRestriction'
                })
            }
        }
    }

    return result;
}
