#!/bin/bash
echo "Do you want to checkout? Y/N";

read check_out
if [ "$check_out" = "Y" ]; then
  echo "Checkout Branch Name"
  read branch_name

  echo "Branch Name $branch_name";

  git checkout $branch_name 
  cd src/graphql && git checkout $branch_name
fi

echo "Do you want to hard reset? Y/N";
read hard_reset
if [ "$hard_reset" = "Y" ]; then
  git reset --hard
  git reset -- src/graphql
fi

echo "Do you want to create new branch? Y/N";
read create_new_branch
if [ "$create_new_branch" = "Y" ]; then
  echo "Type your new branch name";

  read branch_name
  echo "Branch Name $branch_name";

  git checkout -b  $branch_name
  cd src/graphql && git checkout -b  $branch_name
fi

echo "Do you want to push? Y/N";
read push
if [ "$push" = "Y" ]; then

  git push
  cd src/graphql &@ git push 
fi