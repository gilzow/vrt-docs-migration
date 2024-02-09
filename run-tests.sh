#!/usr/bin/env bash

function failed_report() {
    vendor="${1}"
    marker="${2}"
    printf "The test for %s failed. Would you like for me to open the report? Y/n: " "${vendor}"
    read -r openReport
    reportLocation="./backstop_data/html_report-${vendor}-${marker}/index.html"
    if [[ "y" == "${openReport}" ]] || [[ "Y" == "${openReport}" ]]; then
      open "${reportLocation}"
    else
      printf "Ok. You can find the report at: \n%s\n" "${reportLocation}"
    fi
}

function run_tests() {
    baseDomain="${1}"
    vendor="${2}"
    marker="${3}"

    if [[ "upsun" == "${vendor}" ]]; then
      referenceURL="https://docs.upsun.com/"
      testURL="https://docs.upsun.com.${baseDomain}/"

    else
      referenceURL="https://docs.platform.sh/"
      testURL="https://${baseDomain}/"
    fi

    printf "Creating Backstop VRT reference for %s... \n" "${referenceURL}"
    npm run-script backstop:reference -- --refURL="${referenceURL}" --testURL="${testURL}" --testPath="./tests/" --vendor="${vendor}" --marker="${marker}"
    printf "Running tests against %s\n" "${testURL}"
    pSuppress=$(npm run-script backstop:test -- --refURL="${referenceURL}" --testURL="${testURL}" --testPath="./tests/" --vendor="${vendor}" --marker="${marker}")
    pFailure=$?

    return ${pFailure}

}

# we need the URL/domain of the PR environment
printf "PR environment URL for docs.platform.sh? "
read -r URL

# Standard "are you sure?" before we start
printf "Have you updated the template-paths.js file in the tests directory? Y/n: "
read -r continue

if [[ "${continue}" != "y" ]] && [[ "${continue}" != "Y" ]]; then
  echo "Exiting.";
  exit 1
fi

# we need just the domain so we can create the domain for upsun
baseDomain=$(echo "$URL" | sed -E -e 's_.*://([^/@]*@)?([^/:]+).*_\2_')

# shouldnt be here, but let's remove it just in case it is
if [[ -d "./backstop_data/bitmaps_reference" ]]; then
  rm -rf "./backstop_data/bitmaps_reference"
fi

if [[ -d "./backstop_data/html_report" ]]; then
  rm -rf "./backstop_data/html_report"
fi

# we need something unique for this run so we can store different references and test results
marker=$(date +%s)

# all the vendors
vendors=( "platform" "upsun" )

# Counters are cool
i=1
for vendor in "${vendors[@]}"
do
  printf "looking at %s \n" "${vendor}"
  run_tests "${baseDomain}" "${vendor}" "${marker}"
  success=$?
  if ((0 != success )); then
    failed_report "${vendor}" "${marker}"
  else
    printf "No issues detected with %s.\n" "${vendor}"
  fi
  if((1==i)); then
    printf "Would you like me to continue to the next test? Y/n: "
    read -r yeahBoy
    if [[ "Y" != "${yeahBoy}" ]] && [[ "y" != "${yeahBoy}" ]]; then
      exit;
    fi
  fi

  i=$((i+1))
done