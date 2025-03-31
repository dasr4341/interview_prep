package Foundation;

import java.util.Scanner;

public class Count_Length_3 {

    public static void SolveProblem(int n) {

        int c = 0;

        while (n != 0) {
            n = n / 10;
            c++;
        }

        System.out.println(c);
    }

    public static void main(String args[]) throws Exception {
        Scanner scn = new Scanner(System.in);
        int n = scn.nextInt();
        SolveProblem(n);
    }
}
