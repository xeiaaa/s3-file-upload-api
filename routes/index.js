const express = require("express")
const aws = require("aws-sdk")
const router = express.Router()

const bucketName = process.env.AWS_BUCKET
const s3Data = {
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  signatureVersion: "v4",
}

const s3 = new aws.S3(s3Data)

router.get("/s3-url", (req, res) => {
  const { fileName, fileType } = req.query

  const params = {
    Bucket: bucketName,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: "public-read",
  }

  s3.getSignedUrl("putObject", params, (err, data) => {
    if (err) {
      console.log(err)
      return res.end()
    }

    const response = {
      signedRequest: data,
      url: `https://${bucketName}.s3.amazonaws.com/${fileName}`
    }
    res.send(response)
  })
})

module.exports = router
