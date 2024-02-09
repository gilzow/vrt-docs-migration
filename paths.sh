#!/usr/bin/env bash

targetPath="${1}"

pSiteMap="https://docs.platform.sh/sitemap.xml"
uSiteMap="https://docs.upsun.com/sitemap.xml"

vendors=( platform upsun )

echo "Building sitemap files for this migration section..."

for vendor in "${vendors[@]}"
do
  if [[ ! -f "${vendor}.sitemap.xml" ]]; then
    if [[ "upsun" == "${vendor}" ]]; then
      sitemap="${uSiteMap}"
    else
      sitemap="${pSiteMap}"
    fi
    curl "${sitemap}" -o "${vendor}.sitemap.xml"
  fi

  if [[ ! -f "${vendor}.${targetPath}.sitemap.json" ]]; then
    #now let's save the xml to json
    yq -o=json '.urlset.url' test.xml | jq 'map(.loc | capture("\/(?<path>'"${targetPath}"'\/.*$)") | .  )' > "${vendor}.${targetPath}.sitemap.json"
  fi
done

if [[ -f "testpaths.json" ]]; then
  rm testpaths.json
fi

# now we have the sitemap from both sites let's reduce those down to a single file we can use
jq -s '.[0] + .[1] | unique | .[] |= (.label=(.path|gsub("[\/.]";" ")))' "platform.${targetPath}.sitemap.json" "upsun.${targetPath}.sitemap.json" > testpaths.json

# jq -s '.[0] + .[1] | unique | .[] |= (.label=(.path|gsub("[\/.]";" ")))' platform.learn.sitemap.json upsun.learn.sitemap.json > testpaths.json
#  jq -s '.[0] + .[1] | unique' platform.learn.sitemap.json upsun.learn.sitemap.json | jq '.[] |= (.label=(.path|gsub("[\/.]";" ")))' > testpaths.json