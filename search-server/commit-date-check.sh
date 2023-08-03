lastcommitdate=$(git log -n1 --pretty='format:%cd' --date=format:'%Y%m%d')
yesterdaydate=$(date +%Y%m%d -d "yesterday")
if [ ${lastcommitdate} -ge ${yesterdaydate} ]; then
	echo "update"
fi


