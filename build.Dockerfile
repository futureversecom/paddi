FROM 437218020055.dkr.ecr.us-west-2.amazonaws.com/build-artifacts:build-cache-acp-demo-1

COPY . .

# To restore workspaces symlinks
RUN ["yarn", "install", "--network-timeout 100000", "--frozen-lockfile"]

RUN ["yarn"]

CMD [ "yarn" ]
