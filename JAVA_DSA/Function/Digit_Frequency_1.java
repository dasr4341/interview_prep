package Function;

import java.util.Scanner;

public class Digit_Frequency_1 {
    public static void SolveProblem(int n, int s) {
        int c = 0;

        while (n != 0) {
            int r = n % 10;
            if (r == s) {
                c++;
            }
            n = n / 10;
        }
        System.out.println(c);
    }

    public static void main(String args[]) throws Exception {
        Scanner scn = new Scanner(System.in);
        int n1 = scn.nextInt();
        int n2 = scn.nextInt();
        SolveProblem(n1, n2);
    }
}
