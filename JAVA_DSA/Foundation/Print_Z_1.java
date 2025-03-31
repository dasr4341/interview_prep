package Foundation;

import java.util.Scanner;

public class Print_Z_1 {
    public static void SolveProblem(int i) {
        for (int x = i; x >= 1; x--) {
            int temp = 0;
            for (int j = 0; j <= x || j <= temp; j++) {
                if (x == 1) {
                    temp = i;
                }
                if (j == x || i == x || x == 1) {
                    System.out.print("*");
                } else {
                    System.out.print(" ");
                }

            }
            System.out.println("");
        }
    }

    public static void main(String[] args) throws Exception {
        Scanner scan = new Scanner(System.in);
        int s = scan.nextInt();
        SolveProblem(s);
    }
}
