
set -u -e

  pattern=relytic:* command=del rescan
  redis-cli del relytic:req:q
  redis-cli del relytic:busy:q
  redis-cli del relytic:1:req:h
  redis-cli hset relytic:1:req:h text 'another test message'
  redis-cli lpush relytic:req:q 1
  redis-cli lpush relytic:req:q exit
  #slackUrl=http://localhost:8031 npm start
  slackUrl=$SLACK_URL slackUsername=SqueakyMonkeyBot npm start
  scanCount=1000 format=terse pattern=relytic:* format=key rescan
  scanCount=1000 format=terse pattern=relytic:*:q command=llen rescan
  scanCount=1000 format=terse pattern=relytic:*:h command=hgetall rescan
