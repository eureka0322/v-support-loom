import json
import urllib.parse
import boto3

print('Loading function')

s3 = boto3.client('s3')
MC_SETTINGS = {
    "TimecodeConfig": {
      "Source": "ZEROBASED"
    },
    "OutputGroups": [
      {
        "Name": "File Group",
        "Outputs": [
          {
            "ContainerSettings": {
              "Container": "MP4",
              "Mp4Settings": {}
            },
            "VideoDescription": {
              "CodecSettings": {
                "Codec": "H_264",
                "H264Settings": {
                  "MaxBitrate": 5000000,
                  "RateControlMode": "QVBR",
                  "SceneChangeDetect": "TRANSITION_DETECTION"
                }
              }
            },
            "AudioDescriptions": [
              {
                "AudioSourceName": "Audio Selector 1",
                "CodecSettings": {
                  "Codec": "AAC",
                  "AacSettings": {
                    "Bitrate": 96000,
                    "CodingMode": "CODING_MODE_2_0",
                    "SampleRate": 48000
                  }
                }
              }
            ]
          }
        ],
        "OutputGroupSettings": {
          "Type": "FILE_GROUP_SETTINGS",
          "FileGroupSettings": {
            "Destination": "s3://vsio-cv-eu1-staging-cr/"
          }
        }
      }
    ],
    "Inputs": [
      {
        "AudioSelectors": {
          "Audio Selector 1": {
            "DefaultSelection": "DEFAULT"
          }
        },
        "VideoSelector": {},
        "TimecodeSource": "ZEROBASED",
        "FileInput": None,
    }
  ]
}

def trigger_mediaconvert(bucket, name):
    # get the account-specific mediaconvert endpoint for this region
    mediaconvert_client = boto3.client('mediaconvert', region_name="eu-west-1")
    endpoints = mediaconvert_client.describe_endpoints()

    # add the account-specific endpoint to the client session 
    client = boto3.client('mediaconvert', region_name="eu-west-1", endpoint_url=endpoints['Endpoints'][0]['Url'], verify=False)
    
    MC_SETTINGS["Inputs"][0]["FileInput"] = f"s3://{bucket}/{name}"
    role = "arn:aws:iam::494948610654:role/service-role/MediaConvert_Default_Role"
    job = client.create_job(Role=role, UserMetadata={}, Settings=MC_SETTINGS)

def lambda_handler(event, context):
    #print("Received event: " + json.dumps(event, indent=2))

    # Get the object from the event and show its content type
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'], encoding='utf-8')
    
    try:
        response = s3.get_object(Bucket=bucket, Key=key)
        trigger_mediaconvert(bucket, key)
        return response['ContentType']
    except Exception as e:
        print(e)
        print('Error getting object {} from bucket {}. Make sure they exist and your bucket is in the same region as this function.'.format(key, bucket))
        raise e

